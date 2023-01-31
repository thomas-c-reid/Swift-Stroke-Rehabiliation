using AutoMapper;
using MediatR;
using SwiftUserManagement.Application.Contracts.Infrastructure;
using SwiftUserManagement.Application.Contracts.Persistence;
using SwiftUserManagement.Application.Features.Queries.GetUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.GetGameResults
{
    // Handling retrieving the game results
    public class GetGameResultsQueryHandler : IRequestHandler<GetGameResultsQuery, string>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IMassTransitFactory _massTransitRepository;

        public GetGameResultsQueryHandler(IUserRepository userRepository, IMapper mapper, IMassTransitFactory massTransitRepository)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _massTransitRepository = massTransitRepository ?? throw new ArgumentNullException(nameof(massTransitRepository));
        }

        // Handling the game results query
        public async Task<string> Handle(GetGameResultsQuery request, CancellationToken cancellationToken)
        {
            // Retrieving a list of game results
            var results = await _userRepository.GetGameResults(request.User_Id);

            // Mapping the game results one by one to the correct data type as the infrastructure can't see the domain
            var resultListWithCorrectType = new List<GameResultWithDateVm>();
            // If the amount of data results requested is less than there is in the list, it will only return that many

            for(int i = 0; i < results.Count(); i++)
            {
                 var tempResult = _mapper.Map<GameResultWithDateVm>(results[i]);
                 resultListWithCorrectType.Add(tempResult);
            }

            // Emitting game results to the analysis on RabbitMQ
            var resultFromRabbitMQ = await _massTransitRepository.EmitGameResults(resultListWithCorrectType);

            if (resultFromRabbitMQ == "Invalid result")
            {
                return "The game data is incorrect";
            }

            if (resultFromRabbitMQ == "Connection error")
            {
                return "Can't connect to RabbitMQ/ Received an error";
            }
            Thread.Sleep(1000);

            var receivedData = await _massTransitRepository.ReceiveGameResults();

            // Returning the game results in the correct data type
            return receivedData;
        }
    }
}
