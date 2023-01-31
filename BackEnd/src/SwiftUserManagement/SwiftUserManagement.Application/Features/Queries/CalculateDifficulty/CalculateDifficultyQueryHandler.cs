using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using SwiftUserManagement.Application.Contracts.Infrastructure;
using SwiftUserManagement.Application.Contracts.Persistence;
using SwiftUserManagement.Application.Features.Queries.GetGameResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.CalculateDifficulty
{
    // Handler for the calculate difficulty analysis, it gets the new difficulty from the python service and returns it back to the front end
    public class CalculateDifficultyQueryHandler : IRequestHandler<CalculateDifficultyQuery, string>
    {
        private readonly IMassTransitFactory _massTransitRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<CalculateDifficultyQueryHandler> _logger;

        public CalculateDifficultyQueryHandler(IMassTransitFactory massTransitRepository, IUserRepository userRepository, IMapper mapper, ILogger<CalculateDifficultyQueryHandler> logger)
        {
            _massTransitRepository = massTransitRepository ?? throw new ArgumentNullException(nameof(massTransitRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<string> Handle(CalculateDifficultyQuery request, CancellationToken cancellationToken)
        {
            // Checking if the user exists
            _logger.LogInformation("Checking if user exists in database");
            var user = await _userRepository.GetUser(request.UserName);
            if (user == null)
                return "User not found";

            // Retrieving a list of all game results 
            _logger.LogInformation("Retrieving history of game results from database");
            var results = await _userRepository.GetGameResults(request.User_Id);

            // If there are no previous results, set difficulty to 50
            if(results.Count() == 0)
            {
                return "{\"newDifficulty\": 50}";
            }

            // Mapping the game results one by one to the correct data type as the infrastructure can't see the domain
            var resultListWithCorrectType = new List<GameResultWithDateVm>();
            for (int i = 0; i < results.Count(); i++)
            {
                var tempResult = _mapper.Map<GameResultWithDateVm>(results[i]);
                resultListWithCorrectType.Add(tempResult);
            }

            // Sending the game results to the python-calculate-difficulty service
            var result = await _massTransitRepository.EmitCalculateGameDifficulty(resultListWithCorrectType);

            if (result == "Invalid result")
            {
                return "The game data is incorrect";
            }

            if (result == "Connection error")
            {
                return "Can't connect to RabbitMQ/ Received an error";
            }
            Thread.Sleep(1000);

            // Receiving the data from the python-game analysis service
            var receivedData = await _massTransitRepository.ReceiveGameDifficulty();

            return receivedData;

        }
    }
}
