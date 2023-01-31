using AutoMapper;
using MediatR;
using SwiftUserManagement.Application.Contracts.Infrastructure;
using SwiftUserManagement.Application.Contracts.Persistence;
using SwiftUserManagement.Application.Features.Queries.GetGameResults;

namespace SwiftUserManagement.Application.Features.Commands.AnalyseGameResults
{
    // Handling the game results analysis
    public class AnalyseGameResultsHandler : IRequestHandler<AnalyseGameResultsCommand, string>
    {
        private readonly IMassTransitFactory _massTransitRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public AnalyseGameResultsHandler(IMassTransitFactory massTransitRepository, IUserRepository userRepository, IMapper mapper)
        {
            _massTransitRepository = massTransitRepository ?? throw new ArgumentNullException(nameof(massTransitRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<string> Handle(AnalyseGameResultsCommand request, CancellationToken cancellationToken)
        {
            // Checking if the user exists
            var user = await _userRepository.GetUser(request.UserName);
            if (user == null)
                return "User not found";

            // Saves this result to the database
            await _userRepository.AddGameAnalysisData(request.timeTaken, request.accuracy, request.difficulty, request.User_Id, request.level, "");

            // Retrieving a list of all game results 
            var results = await _userRepository.GetGameResults(request.User_Id);

            // Mapping the game results one by one to the correct data type as the infrastructure can't see the domain
            var resultListWithCorrectType = new List<GameResultWithDateVm>();
            for (int i = 0; i < results.Count(); i++)
            {
                  var tempResult = _mapper.Map<GameResultWithDateVm>(results[i]);
                  resultListWithCorrectType.Add(tempResult);
            }

            // Sending the game results to the python-game analysis service
            var result = await _massTransitRepository.EmitGameAnalysis(resultListWithCorrectType);

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
            var receivedData = await _massTransitRepository.ReceiveGameAnalysis();

            return receivedData;
        }
    }
}
