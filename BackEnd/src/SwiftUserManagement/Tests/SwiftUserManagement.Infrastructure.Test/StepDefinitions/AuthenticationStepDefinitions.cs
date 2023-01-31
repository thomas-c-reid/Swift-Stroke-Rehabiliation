using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using SwiftUserManagement.Application.Contracts.Persistence;
using SwiftUserManagement.Domain.Entities;
using SwiftUserManagement.Infrastructure.Repositories;
using TechTalk.SpecFlow.Assist;

namespace SwiftUserManagement.Infrastructure.Test.StepDefinitions
{
    // Step defintions (Test Code) for the authentication feature

    [Binding]
    public class AuthenticationStepDefinitions
    {
        private readonly Mock<IUserRepository> _userRepository = new();
        private readonly Mock<ILogger<JWTManagementFactory>> _logger = new();
        private User user = new();
        private Tokens token = new();


        [Given(@"The user is valid")]
        public void GivenTheUserIsValid(Table table)
        {
            // Arrange
            user = table.CreateInstance<User>();
        }

        [Given(@"The user's password is invalid")]
        public void GivenTheUserIsInvalid(Table table)
        {
            // Arrange
            user = table.CreateInstance<User>();
        }

        [Given(@"The user's email is invalid")]
        public void GivenTheUsersEmailIsInvalid(Table table)
        {
            // Arrange
            user = table.CreateInstance<User>();
        }


        [When(@"The user authenticates")]
        public async void WhenTheUserAuthenticates()
        {
            //Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"JWT:Key", "SWIFTSECRETKEY12345678910"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            JWTManagementFactory _JWTRepo = new(
                configuration,
                _userRepository.Object,
                _logger.Object);

            User userFromDb = new User();
            userFromDb.Email = "michalguzym@gmail.com";
            userFromDb.Password = BCrypt.Net.BCrypt.HashPassword("password");
            _userRepository.Setup(m => m.GetUserByEmail(It.IsAny<String>())).Returns(Task.FromResult(userFromDb));

            // Act
            token =  await _JWTRepo.Authenticate(user.Email, user.Password);
        }

        [Then(@"The user should receive a JWT token")]
        public void ThenTheUserShouldReceiveAJWTToken()
        {
            // Assert
            token.Should().BeOfType<Tokens>();
            token.Should().NotBeNull();
            token.Token.Should().NotBe("Unauthorized");
        }

        [Then(@"The user should be unauthorized")]
        public void ThenTheUserShouldBeUnauthorized()
        {
            // Assert
            token.Should().BeOfType<Tokens>();
            token.Should().NotBeNull();
            token.Token.Should().Be("Unauthorized");
        }

    }
}
