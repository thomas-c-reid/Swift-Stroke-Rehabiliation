using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using SwiftUserManagement.Application.Features.Commands.AnalyseGameResults;
using SwiftUserManagement.Application.Features.Commands.AnalyseVideoResults;
using SwiftUserManagement.Application.Features.Commands.AuthenticateUser;
using SwiftUserManagement.Application.Features.Commands.ChangePassword;
using SwiftUserManagement.Application.Features.Commands.CreateUser;
using SwiftUserManagement.Application.Features.Queries.CalculateDifficulty;
using SwiftUserManagement.Application.Features.Queries.GetGameResults;
using SwiftUserManagement.Application.Features.Queries.GetUser;
using SwiftUserManagement.Application.Features.Queries.GetUserByEmail;
using SwiftUserManagement.Application.Mappings;
using System.Reflection;

namespace SwiftUserManagement.Application
{
    public static class ApplicationServiceRegistration
    {
        // Registering dependencies in the application project, this is called in the program.cs where the rest of all the dependencies are registered
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {

            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddMediatR(Assembly.GetExecutingAssembly());

            // Setting up the mapper
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new UserManagementMappingProfile());
            });

            var mapper = config.CreateMapper();
            services.AddSingleton(mapper);

            return services;
        }
    }
}
