using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SwiftUserManagement.Application.Contracts.Infrastructure;
using SwiftUserManagement.Application.Contracts.Persistence;
using SwiftUserManagement.Infrastructure.Persistence;
using SwiftUserManagement.Infrastructure.Repositories;

namespace SwiftUserManagement.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        // Registering dependencies in the infrastructure project, this is called in the program.cs where the rest of all the dependencies are registered
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {

            // Setting up the repositories
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddScoped<IJWTManagementFactory, JWTManagementFactory>();

            // If the environment is development, use rabbitmq
            if(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT").ToString() == "Development")
            {
                services.AddScoped<IMassTransitFactory, RabbitMQFactory>();
            }
            // If the application has been deployed, use the azure service bus factory
            else
            {
                services.AddScoped<IMassTransitFactory, AzureServiceBusFactory>();
            }

            return services;
        }
    }
}
