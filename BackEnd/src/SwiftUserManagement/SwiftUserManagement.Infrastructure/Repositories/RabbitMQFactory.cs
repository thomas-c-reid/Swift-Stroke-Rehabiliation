using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SwiftUserManagement.Application.Contracts.Infrastructure;
using SwiftUserManagement.Application.Features.Queries.GetGameResults;
using SwiftUserManagement.Domain.Entities;
using System.Text;
using System.Text.Json;

namespace SwiftUserManagement.Infrastructure.Repositories
{
    // Concrete class for emitting tasks out to the rabbitMQ queue
    public class RabbitMQFactory : IMassTransitFactory
    {
        private readonly ILogger<RabbitMQFactory> _Logger;
        private readonly IConfiguration _configuration;

        public RabbitMQFactory(ILogger<RabbitMQFactory> logger, IConfiguration configuration)
        {
            _Logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        // Sending out the game score analysis task to the queue
        public Task<string> EmitGameAnalysis(List<GameResultWithDateVm> results)
        { 
            for(int i = 0; i < results.Count(); i++)
            {
                if (results[i].accuracy == 0)
                {
                    _Logger.LogInformation("Invalid accuracy");
                    return Task.FromResult("Invalid result");
                }
                if (results[i].timeTaken == 0)
                {
                    _Logger.LogInformation("Invalid time taken");
                    return Task.FromResult("Invalid result");
                }
                if (!(results[i].level == 1))
                {
                    _Logger.LogInformation("Invalid level");
                    return Task.FromResult("Invalid result");
                }
            }

            // Connecting to the RabbitMQ queue
            try
            {
                var factory = new ConnectionFactory() { HostName = _configuration["RabbitMQSettings:Host"] };
                using (var connection = factory.CreateConnection())
                using (var channel = connection.CreateModel())
                {
                    _Logger.LogInformation("Sending game results for analysis");

                    // Setting up and sending the message
                    channel.ExchangeDeclare(exchange: "swift_rehab_app",
                                            type: "topic");

                    var routingKey = "game.score.fromApp";
                    var gameResults = results;
                    var message = JsonSerializer.Serialize(gameResults);
                    var body = Encoding.UTF8.GetBytes(message);
                    channel.BasicPublish(exchange: "swift_rehab_app",
                                         routingKey: routingKey,
                                         basicProperties: null,
                                         body: body);
                    _Logger.LogInformation("Sent game results for analysis");

                    return Task.FromResult("Sent game results for analysis");
                }
            }
            catch (Exception e)
            {
                _Logger.LogInformation($"Can't connect to RabbitMQ: {e.Message}");
                return Task.FromResult("Connection error");
            }
            
        }

        // Emitting the game results out to the back end
        public Task<string> EmitGameResults(List<GameResultWithDateVm> gameResults)
        {
            // Checking if the game results are valid
            for (int i = 0; i < gameResults.Count(); i++)
            {
                if (gameResults[i].accuracy == 0)
                {
                    _Logger.LogInformation("Invalid accuracy");
                    return Task.FromResult("Invalid result");
                }
                if (gameResults[i].timeTaken == 0)
                {
                    _Logger.LogInformation("Invalid time taken");
                    return Task.FromResult("Invalid result");
                }
                if (!(gameResults[i].level == 1))
                {
                    _Logger.LogInformation("Invalid level");
                    return Task.FromResult("Invalid result");
                }
            }

            // Connecting to the RabbitMQ queue
            try
            {
                var factory = new ConnectionFactory() { HostName = _configuration["RabbitMQSettings:Host"] };
                using (var connection = factory.CreateConnection())
                using (var channel = connection.CreateModel())
                {
                    _Logger.LogInformation("Sending game results for analysis");

                    // Setting up and sending the message
                    channel.ExchangeDeclare(exchange: "swift_rehab_app",
                                            type: "topic");

                    var routingKey = "game.results.fromApp";
                    var message = JsonSerializer.Serialize(gameResults);
                    var body = Encoding.UTF8.GetBytes(message);
                    channel.BasicPublish(exchange: "swift_rehab_app",
                                         routingKey: routingKey,
                                         basicProperties: null,
                                         body: body);
                    _Logger.LogInformation("Sent game results for analysis");

                    return Task.FromResult("Sent game results for analysis");
                }
            }
            catch (Exception e)
            {
                _Logger.LogInformation($"Can't connect to RabbitMQ: {e.Message}");
                return Task.FromResult("Connection error");
            }
        }

        // Retrieving game results to show on graph
        public Task<string> ReceiveGameResults()
        {
            string receivedMessage = "";

            var factory = new ConnectionFactory() { HostName = _configuration["RabbitMQSettings:Host"] };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: "swift_rehab_app", type: "topic");
                var queueName = channel.QueueDeclare().QueueName;

                channel.QueueBind(queue: queueName,
                                  exchange: "swift_rehab_app",
                                  routingKey: "results.toC#");

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    receivedMessage = Encoding.UTF8.GetString(body);
                    var routingKey = ea.RoutingKey;

                    _Logger.LogInformation("Game results received '{0}':'{1}", routingKey, receivedMessage);
                };

                channel.BasicConsume(queue: queueName,
                                     autoAck: true,
                                     consumer: consumer);

                int logValue = 0;
                while (receivedMessage == "")
                {
                    logValue++;
                    if (logValue % 500 == 0)
                    {
                        _Logger.LogInformation("Haven't received result yet");
                    }
                    Thread.Sleep(10);
                    channel.BasicConsume(queue: queueName,
                                     autoAck: true,
                                     consumer: consumer);
                    if (logValue > 1000)
                    {
                        return Task.FromResult("The request has timed out");
                    }
                }

                return Task.FromResult(receivedMessage);
            }
        }

        // Emitting video analysis out to python
        public async Task<bool> EmitVideonalysis(IFormFile video)
        {
            if (video == null)
            {
                return false;
            }

            // Connecting to the RabbitMQ queue
            try
            {
                var factory = new ConnectionFactory() { HostName = _configuration["RabbitMQSettings:Host"] };
                using (var connection = factory.CreateConnection())
                using (var channel = connection.CreateModel())
                {
                    _Logger.LogInformation("Sending video file for analysis");

                    // Setting up and sending the message
                    channel.ExchangeDeclare(exchange: "swift_rehab_app",
                                            type: "topic");

                    var routingKey = "video.fromApp";

                    MemoryStream ms = new MemoryStream(new byte[video.Length]);
                    await video.CopyToAsync(ms);

                    channel.BasicPublish(exchange: "swift_rehab_app",
                                         routingKey: routingKey,
                                         basicProperties: null,
                                         body: ms.ToArray());
                    _Logger.LogInformation($"Sent video file for analysis + {ms.ToArray()}");

                    return true;
                }
            }
            catch (Exception e)
            {
                _Logger.LogInformation($"Can't connect to RabbitMQ: {e.Message}");
                return false;
            }

        }


        // Receiving the results from the game analysis
        public Task<string> ReceiveGameAnalysis()
        {
            string receivedMessage = "";

            var factory = new ConnectionFactory() { HostName = _configuration["RabbitMQSettings:Host"] };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: "swift_rehab_app", type: "topic");
                var queueName = channel.QueueDeclare().QueueName;

                channel.QueueBind(queue: queueName,
                                  exchange: "swift_rehab_app",
                                  routingKey: "game.toC#");

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    receivedMessage = Encoding.UTF8.GetString(body);
                    var routingKey = ea.RoutingKey;

                    _Logger.LogInformation("Game analysis received '{0}':'{1}", routingKey, receivedMessage);
                };

                channel.BasicConsume(queue: queueName,
                                     autoAck: true,
                                     consumer: consumer);

                int logValue = 0;
                while (receivedMessage == "")
                {
                    logValue++;
                    if (logValue % 500 == 0)
                    {
                        _Logger.LogInformation("Haven't received result yet");
                    }
                    Thread.Sleep(10);
                    channel.BasicConsume(queue: queueName,
                                     autoAck: true,
                                     consumer: consumer);
                    if (logValue > 1000)
                    {
                        return Task.FromResult("The request has timed out");
                    }
                }

                return Task.FromResult(receivedMessage);
            }
        }

        
        // Receiving the video analysis from python
        public Task<string> ReceiveVideonalysis()
        {
            string receivedMessage = "";

            var factory = new ConnectionFactory() { HostName = _configuration["RabbitMQSettings:Host"] };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: "swift_rehab_app", type: "topic");
                var queueName = channel.QueueDeclare().QueueName;

                channel.QueueBind(queue: queueName,
                                  exchange: "swift_rehab_app",
                                  routingKey: "video.toC#");

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    receivedMessage = Encoding.UTF8.GetString(body);
                    var routingKey = ea.RoutingKey;
                };

                channel.BasicConsume(queue: queueName,
                                     autoAck: true,
                                     consumer: consumer);

                int logValue = 0;
                while (receivedMessage == "")
                {
                    logValue++;
                    if (logValue % 500 == 0)
                    {
                        _Logger.LogInformation("Haven't received result yet");
                    }
                    Thread.Sleep(10);
                    channel.BasicConsume(queue: queueName,
                                     autoAck: true,
                                     consumer: consumer);
                    if (logValue > 1000)
                    {
                        return Task.FromResult("The request has timed out");
                    }
                }

                return Task.FromResult(receivedMessage);

            }
        }

        // Emitting the calculate game difficulty to python
        public Task<string> EmitCalculateGameDifficulty(List<GameResultWithDateVm> gameResults)
        {
            // Checking if the game results are valid
            for (int i = 0; i < gameResults.Count(); i++)
            {
                if (gameResults[i].accuracy == 0)
                {
                    _Logger.LogInformation("Invalid accuracy");
                    return Task.FromResult("Invalid result");
                }
                if (gameResults[i].timeTaken == 0)
                {
                    _Logger.LogInformation("Invalid time taken");
                    return Task.FromResult("Invalid result");
                }
                if (!(gameResults[i].level == 1))
                {
                    _Logger.LogInformation("Invalid level");
                    return Task.FromResult("Invalid result");
                }
            }

            // Connecting to the RabbitMQ queue
            try
            {
                var factory = new ConnectionFactory() { HostName = _configuration["RabbitMQSettings:Host"] };
                using (var connection = factory.CreateConnection())
                using (var channel = connection.CreateModel())
                {
                    _Logger.LogInformation("Sending game results for calculating difficulty");

                    // Setting up and sending the message
                    channel.ExchangeDeclare(exchange: "swift_rehab_app",
                                            type: "topic");

                    var routingKey = "game.difficulty.fromApp";
                    var message = JsonSerializer.Serialize(gameResults);
                    var body = Encoding.UTF8.GetBytes(message);
                    channel.BasicPublish(exchange: "swift_rehab_app",
                                         routingKey: routingKey,
                                         basicProperties: null,
                                         body: body);
                    _Logger.LogInformation("Sent game results for analysis");

                    return Task.FromResult("Sent game results for analysis");
                }
            }
            catch (Exception e)
            {
                _Logger.LogInformation($"Can't connect to RabbitMQ: {e.Message}");
                return Task.FromResult("Connection error");
            }
        }

        // Receiving the game difficulty from python
        public Task<string> ReceiveGameDifficulty()
        {
            string receivedMessage = "";

            var factory = new ConnectionFactory() { HostName = _configuration["RabbitMQSettings:Host"] };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: "swift_rehab_app", type: "topic");
                var queueName = channel.QueueDeclare().QueueName;

                channel.QueueBind(queue: queueName,
                                  exchange: "swift_rehab_app",
                                  routingKey: "difficulty.toC#");

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    receivedMessage = Encoding.UTF8.GetString(body);
                    var routingKey = ea.RoutingKey;

                    _Logger.LogInformation("Difficulty results received '{0}':'{1}", routingKey, receivedMessage);
                };

                channel.BasicConsume(queue: queueName,
                                     autoAck: true,
                                     consumer: consumer);

                int logValue = 0;
                while (receivedMessage == "")
                {
                    logValue++;
                    if (logValue % 500 == 0)
                    {
                        _Logger.LogInformation("Haven't received result yet");
                    }
                    Thread.Sleep(10);
                    channel.BasicConsume(queue: queueName,
                                     autoAck: true,
                                     consumer: consumer);
                    if (logValue > 1000)
                    {
                        return Task.FromResult("The request has timed out");
                    }
                }

                return Task.FromResult(receivedMessage);
            }
        }
    }
}
