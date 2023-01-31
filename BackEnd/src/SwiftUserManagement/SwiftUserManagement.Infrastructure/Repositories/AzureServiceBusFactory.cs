using Azure.Messaging.ServiceBus;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SwiftUserManagement.Application.Contracts.Infrastructure;
using SwiftUserManagement.Application.Features.Queries.GetGameResults;
using SwiftUserManagement.Domain.Entities;
using System.Text;
using System.Text.Json;

namespace SwiftUserManagement.Infrastructure.Repositories
{
    // The azure service bus factory which can be used during deployment instead of the rabbitmq factory
    // This code has not been updated as the team has moved away from azure for a more agnostic approach, but it can be updated to work with azure again
    public class AzureServiceBusFactory : IMassTransitFactory
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AzureServiceBusFactory> _logger;
        private string message;

        public AzureServiceBusFactory(IConfiguration configuration, ILogger<AzureServiceBusFactory> logger)
        {
            message = "";
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // Receiving the game analysis
        public async Task<string> ReceiveGameAnalysis()
        {
            var connectionString = _configuration["AzureServiceBus:ConnectionString"];
            string topicName = _configuration["AzureServiceBus:GameToPythonTopic"];
            string subscriptionName = _configuration["AzureServiceBus:GameToC#Subscription"];

            _logger.LogInformation("Waiting for result from python");

            var client = new ServiceBusClient(connectionString);
            var processor = client.CreateProcessor(topicName, subscriptionName, new ServiceBusProcessorOptions());


            try
            {
                // add handler to process messages
                processor.ProcessMessageAsync += MessageHandler;

                // add handler to process any errors
                processor.ProcessErrorAsync += ErrorHandler;

                // start processing 
                await processor.StartProcessingAsync();

                _logger.LogInformation("Processing messages from python");

                Thread.Sleep(1000);

                // stop processing 
                _logger.LogInformation("\nStopping the receiver...");
                await processor.StopProcessingAsync();
                _logger.LogInformation("Stopped receiving messages");
            }
            finally
            {
                // Calling DisposeAsync on client types is required to ensure that network
                // resources and other unmanaged objects are properly cleaned up.
                await processor.DisposeAsync();
                await client.DisposeAsync();
            }

            _logger.LogInformation($"Received result from python: {message}");

            return message;
        }

        // Emitting the video analysis
        public async Task<bool> EmitVideonalysis(IFormFile video)
        {
            string connectionString = _configuration["AzureServiceBus:ConnectionString"];
            string topicName = _configuration["AzureServiceBus:VideoToPythonTopic"];

            MemoryStream ms = new MemoryStream(new byte[video.Length]);
            await video.CopyToAsync(ms);
            var body = ms.ToArray();

            var client = new ServiceBusClient(connectionString);
            var sender = client.CreateSender(topicName);

            ServiceBusMessage messageToSend = new ServiceBusMessage(body);

            try
            {
                _logger.LogInformation("Sending video results for analysis");
                await sender.SendMessageAsync(messageToSend);
                _logger.LogInformation("Published successfully");

            }
            finally
            {
                await sender.DisposeAsync();
                await client.DisposeAsync();
            }

            _logger.LogInformation("Sent video results for analysis");
            return true;
        }

        // Receiving video analysis data
        public async Task<string> ReceiveVideonalysis()
        {
            var connectionString = _configuration["AzureServiceBus:ConnectionString"];
            string topicName = _configuration["AzureServiceBus:GameToPythonTopic"];
            string subscriptionName = _configuration["AzureServiceBus:GameToC#Subscription"];

            _logger.LogInformation("Waiting for result from python");

            var client = new ServiceBusClient(connectionString);
            var processor = client.CreateProcessor(topicName, subscriptionName, new ServiceBusProcessorOptions());


            try
            {
                // add handler to process messages
                processor.ProcessMessageAsync += MessageHandler;

                // add handler to process any errors
                processor.ProcessErrorAsync += ErrorHandler;

                // start processing 
                await processor.StartProcessingAsync();

                _logger.LogInformation("Processing messages from python");

                Thread.Sleep(1000);

                // stop processing 
                _logger.LogInformation("\nStopping the receiver...");
                await processor.StopProcessingAsync();
                _logger.LogInformation("Stopped receiving messages");
            }
            finally
            {
                // Calling DisposeAsync on client types is required to ensure that network
                // resources and other unmanaged objects are properly cleaned up.
                await processor.DisposeAsync();
                await client.DisposeAsync();
            }

            _logger.LogInformation($"Received result from python: {message}");

            return message;
        }

        // Handle received messages
        async Task<string> MessageHandler(ProcessMessageEventArgs args)
        {
            string body = args.Message.Body.ToString();
            _logger.LogInformation($"Received message: {body}");
            message = body;

            await args.CompleteMessageAsync(args.Message);

            return body;
        }

        // Handle any errors when receiving messages
        static Task ErrorHandler(ProcessErrorEventArgs args)
        {

            return Task.CompletedTask;
        }

        // Emitting game analysis
        public async Task<string> EmitGameAnalysis(List<GameResultWithDateVm> results)
        {
            string connectionString = _configuration["AzureServiceBus:ConnectionString"];
            string topicName = _configuration["AzureServiceBus:GameToPythonTopic"];

            var gameResults = results;
            var message = JsonSerializer.Serialize(gameResults);
            var body = Encoding.UTF8.GetBytes(message);

            var client = new ServiceBusClient(connectionString);
            var sender = client.CreateSender(topicName);

            ServiceBusMessage messageToSend = new ServiceBusMessage(body);

            try
            {
                _logger.LogInformation("Sending game results for analysis");
                await sender.SendMessageAsync(messageToSend);
                _logger.LogInformation("Published successfully");

            }
            finally
            {
                await sender.DisposeAsync();
                await client.DisposeAsync();
            }

            _logger.LogInformation("Sent game results for analysis");
            return "Sent game results for analysis";
        }

        // TODO: Not implemented yet
        public Task<string> EmitGameResults(List<GameResultWithDateVm> gameResults)
        {
            throw new NotImplementedException();
        }

        // TODO: Not implemented yet
        public Task<string> ReceiveGameResults()
        {
            throw new NotImplementedException();
        }

        public Task<string> EmitCalculateGameDifficulty(List<GameResultWithDateVm> gameResults)
        {
            throw new NotImplementedException();
        }

        public Task<string> ReceiveGameDifficulty()
        {
            throw new NotImplementedException();
        }
    }
}

