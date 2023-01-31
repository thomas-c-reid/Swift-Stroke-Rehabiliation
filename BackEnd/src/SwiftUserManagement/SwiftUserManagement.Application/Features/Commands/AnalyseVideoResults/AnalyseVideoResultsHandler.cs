using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using SwiftUserManagement.Application.Contracts.Infrastructure;
using SwiftUserManagement.Application.Contracts.Persistence;

namespace SwiftUserManagement.Application.Features.Commands.AnalyseVideoResults
{
    // Handling the sending of video results to rabbitmq and the analysis services, then saving them to the database
    public class AnalyseVideoResultsHandler : IRequestHandler<AnalyseVideoResultsCommand, string>
    {
        
        private readonly ILogger<AnalyseVideoResultsHandler> _logger;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IMassTransitFactory _massTransitRepository;

        public AnalyseVideoResultsHandler(ILogger<AnalyseVideoResultsHandler> logger, IMapper mapper, IUserRepository userRepository, IMassTransitFactory massTransitRepository)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _massTransitRepository = massTransitRepository ?? throw new ArgumentNullException(nameof(massTransitRepository));
        }

        public async Task<string> Handle(AnalyseVideoResultsCommand request, CancellationToken cancellationToken)
        {
            var user = _userRepository.GetUser(request.UserName);
            if (user == null)
            {
                return "User not found";
            }

            _logger.LogInformation("Sending video file to python for analysis.");
            var result = await _massTransitRepository.EmitVideonalysis(request.VideoData[0]);

            if (!result)
            {
                return "Can't connect to RabbitMQ/ Received an error";
            }
            var fileName = request.VideoData[0].FileName;

            _logger.LogInformation("Waiting for response from python script");

            string response = await _massTransitRepository.ReceiveVideonalysis();

            _logger.LogInformation("Adding analysis results into database");

            if (!await(_userRepository.AddVideoAnalysisData(fileName, request.UserId, response)))
                return "Not able to add data into database";

            if (response == "Invalid result")
            {
                return "The game data is incorrect";
            }

            if (response == "The request has timed out")
                return "The request has timed out";

            return (response);
        }
    }
}
