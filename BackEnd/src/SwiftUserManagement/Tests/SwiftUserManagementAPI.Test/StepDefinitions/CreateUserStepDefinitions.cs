using Npgsql;
using System;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.CommonModels;
using FluentResults;
using MediatR;
using Moq;
//using SwiftUserManagement.API.Controllers;
using SwiftUserManagement.Application.Features.Commands.CreateUser;

namespace SwiftUserManagementAPI.Test.StepDefinitions
{
    // TODO: This should be an integration test without mock methods

    [Binding]
    public class CreateUserStepDefinitions
    {
        public readonly Mock<IMediator> _mediatorMock = new();

        [Given(@"The database is up and runnin")]
        public void GivenTheDatabaseIsUpAndRunnin()
        {
            //// Arrange
            //try
            //{
            //    using var connection = new NpgsqlConnection
            //            ("Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234");

            //    // Act
            //    connection.Open();

            //    // Assert
            //    connection.Should().NotBeNull();
            //}
            //catch (Exception e)
            //{
            //    FluentResults.Result.Fail($"Connection to database failed with exception {e}");
            //}
            throw new PendingStepException();
        }

        [When(@"I hit the create user endpoint")]
        public void WhenIHitTheCreateUserEndpoint(CreateUserCommand user)
        {
            //// Arrange
            //var swiftUserManagementController = new SwiftUserManagementController(_mediatorMock.Object);
            //_mediatorMock.Setup(m => m.Send(It.IsAny<CreateUserCommand>(), CancellationToken.None)).Returns(Task.FromResult(1));

            //// Act
            //var result = await swiftUserManagementController.createUser(user);

            //// Assert
            //result.Should().Be($"User: {user.UserName} successfully created");
            throw new PendingStepException();
        }

        [Then(@"The user will be created")]
        public void ThenTheUserWillBeCreated()
        {
            throw new PendingStepException();
        }
    }
}
