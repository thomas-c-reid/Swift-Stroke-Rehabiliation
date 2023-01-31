using Microsoft.Extensions.Logging;
using Moq;
using RabbitMQ.Client;
using SwiftUserManagement.Infrastructure.Repositories;
using FluentResults;
using System.Diagnostics;
using Microsoft.Extensions.Configuration;
using SwiftUserManagement.Application.Features.Queries.GetGameResults;
using Microsoft.AspNetCore.Http;
using System.Text;

namespace SwiftUserManagement.Infrastructure.Test.StepDefinitions
{
    // Step defintions (Test Code) for the authentication feature

    [Binding]
    public class GameAnalysisRabbitMQStepDefinitions
    {
        // Dependency injection
        private readonly Mock<ILogger<RabbitMQFactory>> _logger = new();

        // Variables for emitting game values
        private int accuracy;
        private int timeTaken;
        private int level;
        private string emitGameAnalysisResult = "";

        // Variables for emitting video results
        private IFormFile? video;
        private bool emitVideoAnalysisResult;

        // Function to run a powershell command so RabbitMQ and the correct python service can be spun up
        public static string RunCommand(string arguments)
        {
            var output = string.Empty;
            try
            {
                var startInfo = new ProcessStartInfo
                {
                    Verb = "runas",
                    FileName = "cmd.exe",
                    Arguments = "/C " + arguments,
                    WindowStyle = ProcessWindowStyle.Hidden,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = false
                };

                var proc = Process.Start(startInfo);

                proc.WaitForExit(60000);

                return output;
            }
            catch (Exception)
            {
                return output;
            }
        }

        // Setting up rabbit mq and the game analysis python service for integration tgesting
        // This test assumes that the python-gameanalysis service has already been built and is already stored as an image on the system
        [BeforeTestRun]
        public static void SetupRabbitMQ()
        {
            RunCommand("docker run -d --hostname rabbitmq --name rabbitmq-test -p 5672:5672 -p 15672:15672 rabbitmq:3-management");
            Thread.Sleep(30000); // Wait for the RabbitMQ image to spin up on docker
        }

        [Given(@"The results to be sent through are valid")]
        public void GivenTheResultsToBeSentThroughAreValid(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            accuracy = Convert.ToInt32(row[0]);
            timeTaken = Convert.ToInt32(row[1]);
            level = Convert.ToInt32(row[2]);
        }

        [Given(@"The results to be sent through are invalid")]
        public void GivenTheResultsToBeSentThroughAreInvalid(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            accuracy = Convert.ToInt32(row[0]);
            timeTaken = Convert.ToInt32(row[1]);
            level = Convert.ToInt32(row[2]);
        }

        [Given(@"The video analysis results to be sent through are valid")]
        public void GivenTheVideoAnalysisResultsToBeSentThroughAreValid()
        {
            // Arrange
            string videoName = "Video.mp4";
            // converts a C# string to a byte array
            byte[] byteArray = Encoding.ASCII.GetBytes(videoName);
            Stream stream = new MemoryStream(byteArray);
            video = new FormFile(stream, 0, stream.Length, videoName, videoName);
        }

        [Given(@"The video analysis results to be sent through are invalid")]
        public void GivenTheVideoAnalysisResultsToBeSentThroughAreInvalid()
        {
            // Arrange
            video = null;
        }

        [When(@"The Emit Game analysis function is called")]
        public async void WhenTheEmitGameAnalysisFunctionIsCalled()
        {
            // Arrange 
            var inMemorySettings = new Dictionary<string, string> {
                {"RabbitMQSettings:Host", "localhost"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            RabbitMQFactory rabbitMQFactory = new RabbitMQFactory(_logger.Object, configuration);

            List<GameResultWithDateVm> gameResultsList = new List<GameResultWithDateVm>();
            GameResultWithDateVm gameResult = new GameResultWithDateVm
            {
                User_Id = 1,
                accuracy = accuracy,
                timeTaken = timeTaken,
                level = level,
                explanation = "",
                difficulty = 99,
                DateAddedToDb = DateTime.Now.ToString()
            };
            gameResultsList.Add(gameResult);

            // Act
            emitGameAnalysisResult = await rabbitMQFactory.EmitGameAnalysis(gameResultsList);
        }

        [When(@"The emit video analysis function is called")]
        public async void WhenTheEmitVideoAnalysisFunctionIsCalled()
        {
            // Arrange 
            var inMemorySettings = new Dictionary<string, string> {
                {"RabbitMQSettings:Host", "localhost"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            RabbitMQFactory rabbitMQFactory = new RabbitMQFactory(_logger.Object, configuration);

            // Act
            emitVideoAnalysisResult = await rabbitMQFactory.EmitVideonalysis(video);
        }

        [When(@"The emit video analysis function is called with the wrong hostname")]
        public async void WhenTheEmitVideoAnalysisFunctionIsCalledWithTheWrongHostname()
        {
            // Arrange 
            var inMemorySettings = new Dictionary<string, string> {
                {"RabbitMQSettings:Host", "rabbit1"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            RabbitMQFactory rabbitMQFactory = new RabbitMQFactory(_logger.Object, configuration);

            // Act
            emitVideoAnalysisResult = await rabbitMQFactory.EmitVideonalysis(video);
        }

        [When(@"The Emit Game analysis function is called with the wrong host")]
        public async void WhenTheEmitGameAnalysisFunctionIsCalledWithTheWrongHost()
        {
            // Arrange 
            var inMemorySettings = new Dictionary<string, string> {
                {"RabbitMQSettings:Host", "rabbit"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            RabbitMQFactory rabbitMQFactory = new RabbitMQFactory(_logger.Object, configuration);

            List<GameResultWithDateVm> gameResultsList = new List<GameResultWithDateVm>();
            GameResultWithDateVm gameResult = new GameResultWithDateVm
            {
                User_Id = 1,
                accuracy = accuracy,
                timeTaken = timeTaken,
                level = level,
                explanation = "",
                difficulty = 99,
                DateAddedToDb = DateTime.Now.ToString()
            };
            gameResultsList.Add(gameResult);

            // Act
            emitGameAnalysisResult = await rabbitMQFactory.EmitGameAnalysis(gameResultsList);
        }

        [When(@"The emit game results rabbitmq function is called")]
        public async void WhenTheEmitGameResultsRabbitmqFunctionIsCalled()
        {
            // Arrange 
            var inMemorySettings = new Dictionary<string, string> {
                {"RabbitMQSettings:Host", "localhost"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            RabbitMQFactory rabbitMQFactory = new RabbitMQFactory(_logger.Object, configuration);

            List<GameResultWithDateVm> gameResultsList = new List<GameResultWithDateVm>();
            GameResultWithDateVm gameResult = new GameResultWithDateVm
            {
                User_Id = 1,
                accuracy = accuracy,
                timeTaken = timeTaken,
                level = level,
                explanation = "",
                difficulty = 99,
                DateAddedToDb = DateTime.Now.ToString()
            };
            gameResultsList.Add(gameResult);

            // Act
            emitGameAnalysisResult = await rabbitMQFactory.EmitGameResults(gameResultsList);
        }

        [When(@"The emit difficulty function is called")]
        public async void WhenTheEmitDifficultyFunctionIsCalled()
        {
            // Arrange 
            var inMemorySettings = new Dictionary<string, string> {
                {"RabbitMQSettings:Host", "localhost"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            RabbitMQFactory rabbitMQFactory = new RabbitMQFactory(_logger.Object, configuration);

            List<GameResultWithDateVm> gameResultsList = new List<GameResultWithDateVm>();
            GameResultWithDateVm gameResult = new GameResultWithDateVm
            {
                User_Id = 1,
                accuracy = accuracy,
                timeTaken = timeTaken,
                level = level,
                explanation = "",
                difficulty = 99,
                DateAddedToDb = DateTime.Now.ToString()
            };
            gameResultsList.Add(gameResult);

            // Act
            emitGameAnalysisResult = await rabbitMQFactory.EmitCalculateGameDifficulty(gameResultsList);
        }

        [When(@"The emit difficulty function is called with the wrong hostname")]
        public async void WhenTheEmitDifficultyFunctionIsCalledWithTheWrongHostname()
        {
            // Arrange 
            var inMemorySettings = new Dictionary<string, string> {
                {"RabbitMQSettings:Host", "rabbit1"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            RabbitMQFactory rabbitMQFactory = new RabbitMQFactory(_logger.Object, configuration);

            List<GameResultWithDateVm> gameResultsList = new List<GameResultWithDateVm>();
            GameResultWithDateVm gameResult = new GameResultWithDateVm
            {
                User_Id = 1,
                accuracy = accuracy,
                timeTaken = timeTaken,
                level = level,
                explanation = "",
                difficulty = 99,
                DateAddedToDb = DateTime.Now.ToString()
            };
            gameResultsList.Add(gameResult);

            // Act
            emitGameAnalysisResult = await rabbitMQFactory.EmitCalculateGameDifficulty(gameResultsList);
        }



        [When(@"The emit game results rabbitmq function is called with the wrong host")]
        public async void WhenTheEmitGameResultsRabbitmqFunctionIsCalledWithTheWrongHost()
        {
            // Arrange 
            var inMemorySettings = new Dictionary<string, string> {
                {"RabbitMQSettings:Host", "rabbitmq"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            RabbitMQFactory rabbitMQFactory = new RabbitMQFactory(_logger.Object, configuration);

            List<GameResultWithDateVm> gameResultsList = new List<GameResultWithDateVm>();
            GameResultWithDateVm gameResult = new GameResultWithDateVm
            {
                User_Id = 1,
                accuracy = accuracy,
                timeTaken = timeTaken,
                level = level,
                explanation = "",
                difficulty = 99,
                DateAddedToDb = DateTime.Now.ToString()
            };
            gameResultsList.Add(gameResult);

            // Act
            emitGameAnalysisResult = await rabbitMQFactory.EmitGameResults(gameResultsList);
        }

        [Then(@"The result from this method call should be true")]
        public void ThenTheResultFromThisMethodCallShouldBeTrue()
        {
            // Assert
            emitGameAnalysisResult.Should().Be("Sent game results for analysis");
        }

        [Then(@"The result from this method call should be false")]
        public void ThenTheResultFromThisMethodCallShouldBeFalse()
        {
            // Assert
            emitGameAnalysisResult.Should().Be("Invalid result");
        }

        [Then(@"the result from this method call should return a connection error")]
        public void ThenTheResultFromThisMethodCallShouldReturnAConnectionError()
        {
            emitGameAnalysisResult.Should().Be("Connection error");
        }

        [Then(@"The result from the emit video analysis should be true")]
        public void ThenTheResultFromTheEmitVideoAnalysisShouldBeTrue()
        {
            emitVideoAnalysisResult.Should().Be(true);
        }

        [Then(@"The result from the emit video analysis method call should be false")]
        public void ThenTheResultFromTheEmitVideoAnalysisMethodCallShouldBeFalse()
        {
            emitVideoAnalysisResult.Should().Be(false);
        }




        [AfterTestRun]
        public static void TearDownRabbitMQ()
        {
            RunCommand("docker stop rabbitmq-test");

            RunCommand("docker rm rabbitmq-test");
        }
    }
}
