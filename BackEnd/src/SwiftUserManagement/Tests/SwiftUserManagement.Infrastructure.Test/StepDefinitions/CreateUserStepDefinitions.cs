using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Npgsql;
using SwiftUserManagement.API.Extensions;
using SwiftUserManagement.Domain.Entities;
using SwiftUserManagement.Infrastructure.Persistence;
using System;
using System.Diagnostics;
using TechTalk.SpecFlow;

namespace SwiftUserManagement.Infrastructure.Test.StepDefinitions
{
    // Step defintions (Test Code) for the user repository (all code for saving and reading from the database)
    [Binding]
    public class CreateUserStepDefinitions
    {
        // Generating the private variables which the tests will use
        private User user;
        private User userFromDb;
        private string email;
        private string userName;
        private string userNameToCheck;
        private string passwordToCheck;
        private string password;
        private string role;
        private string videoName;
        private string weaknessPrediction;
        private string explanation = "string";
        private int id;
        private bool boolResponse;

        private double accuracy;
        private double timetaken;
        private int difficulty;

        private List<GameResultsWithDate> gamesList;

        // Mocks needed to instantiate a user repository
        private readonly Mock<ILogger<UserRepository>> _logger = new();

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

        // Setting up database so that the program can connect and use the database
        // This test assumes that the postgres image already exists on the system
        // The users passwords will also be saved in a non hashed format here as this functionality happens in the application part of the system
        [BeforeTestRun]
        public static void SetupUserDb()
        {
            RunCommand("docker run --name userdb-test -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin1234 -e POSTGRES_DB=UsersDb -d -p 5432:5432 postgres");
            Thread.Sleep(3000); // Wait for the userDB Image to spin up on docker

            // Setting up the database
            using var connection = new NpgsqlConnection
                        ("Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234");
            connection.Open();

            using var command = new NpgsqlCommand
            {
                Connection = connection
            };

            // Dropping tables to ensure a clean slate
            command.CommandText = "DROP TABLE IF EXISTS Videos";
            command.ExecuteNonQuery();

            command.CommandText = "DROP TABLE IF EXISTS GameScores";
            command.ExecuteNonQuery();

            command.CommandText = "DROP TABLE IF EXISTS Users";
            command.ExecuteNonQuery();

            // Creating and populating the users table
            command.CommandText = @"CREATE TABLE Users(Id SERIAL PRIMARY KEY,
                                                                email VARCHAR(24) NOT NULL,
                                                                username VARCHAR(24) NOT NULL,
                                                                password VARCHAR NOT NULL,
                                                                role VARCHAR(24) NOT NULL
                                                                )";
            command.ExecuteNonQuery();

            command.CommandText = "INSERT INTO users(email, username, password, role) VALUES('michalguzym@gmail.com', 'Michal Guzy', '$2a$12$BFN3V/Rt6tSsO3Lpz4ue8O.Bg.Jb5dA7l08/LPBn./PpSiRQPO16a', 'User');";
            command.ExecuteNonQuery();

            command.CommandText = "INSERT INTO Users(email, username, password, role) VALUES('sophie@gmail.com', 'Sophie Young', '$2a$12$BFN3V/Rt6tSsO3Lpz4ue8O.Bg.Jb5dA7l08/LPBn./PpSiRQPO16a', 'User');";
            command.ExecuteNonQuery();

            command.CommandText = "INSERT INTO Users(email, username, password, role) VALUES('sarah@gmail.com', 'Sarah', '$2a$12$BFN3V/Rt6tSsO3Lpz4ue8O.Bg.Jb5dA7l08/LPBn./PpSiRQPO16a', 'User');";
            command.ExecuteNonQuery();

            // Creating and populating the videos table
            command.CommandText = @"CREATE TABLE Videos(Id SERIAL PRIMARY KEY,
                                                                User_Id INT NOT NULL,
                                                                Video_Name VARCHAR(255) NOT NULL,
                                                                Weakness_Prediction TEXT,
                                                                CONSTRAINT fk_user
                                                                    FOREIGN KEY(User_Id)
                                                                        REFERENCES Users(Id))";
            command.ExecuteNonQuery();

            //command.CommandText = "INSERT INTO Videos(User_Id, Video_Name, Weakness_Prediction) VALUES(1, 'Video.mp4', '{'Message':'Empty'}');";
            //command.ExecuteNonQuery();

            // Creating and populating the game scores table
            command.CommandText = @"CREATE TABLE GameScores(Id SERIAL PRIMARY KEY,
                                                                    User_Id INT NOT NULL,
                                                                    Level INT NOT NULL,
                                                                    Accuracy INT NOT NULL,
                                                                    TimeTaken INT NOT NULL,
                                                                    Difficulty INT NOT NULL,
                                                                    Explanation VARCHAR(255) NOT NULL,
                                                                    DateAddedToDb VARCHAR(255) NOT NULL,
                                                                    CONSTRAINT fk_user
                                                                        FOREIGN KEY(User_Id)
                                                                            REFERENCES Users(Id))";
            command.ExecuteNonQuery();

            command.CommandText = $"INSERT INTO GameScores(User_Id, Level, Accuracy, TimeTaken, Difficulty, Explanation, DateAddedToDb) VALUES(1, 1, 45, 50, 90, 'No stroke symptoms', '{DateTime.Now}');";
            command.ExecuteNonQuery();
            command.CommandText = $"INSERT INTO GameScores(User_Id, Level, Accuracy, TimeTaken, Difficulty, Explanation, DateAddedToDb) VALUES(1, 1, 27, 23, 100, 'No stroke symptoms', '{DateTime.Now.AddDays(-1)}');";
            command.ExecuteNonQuery();
            command.CommandText = $"INSERT INTO GameScores(User_Id, Level, Accuracy, TimeTaken, Difficulty, Explanation, DateAddedToDb) VALUES(1, 1, 66, 25, 80, 'No stroke symptoms', '{DateTime.Now.AddDays(-2)}');";
            command.ExecuteNonQuery();

            
            connection.Close();
        }

        [Given(@"The game data is")]
        public void GivenTheGameDataIs(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            accuracy = Convert.ToDouble(row[0]);
            timetaken = Convert.ToDouble(row[1]);
            difficulty = Convert.ToInt32(row[2]);
            id = Convert.ToInt32(row[3]);
        }


        [Given(@"The user to be added to the database is valid")]
        public void GivenTheUserToBeAddedToTheDatabaseIsValid(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            email = row[0].ToString();
            userName = row[1].ToString();
            password = row[2].ToString();
            role = row[3].ToString();
        }

        [Given(@"The user to be checked is valid")]
        public void GivenTheUserToBeCheckedIsValid(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            email = row[0].ToString();
            userName = row[1].ToString();
            password = row[2].ToString();
            role = row[3].ToString();

            user = new User
            {
                Email = email,
                UserName = userName,
                Password = password,
                Role = role
            };
        }

        [Given(@"The video analysis data is")]
        public void GivenTheVideoAnalysisDataIs(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            videoName = row[0].ToString();
            id = Convert.ToInt32(row[1]);
            weaknessPrediction = row[2].ToString();
        }



        [Given(@"The username is")]
        public void GivenTheUsernameIsValid(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            userName = row[0].ToString();
        }

        [Given(@"The username to check is")]
        public void GivenTheUsernameToCheckIs(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            userNameToCheck = row[0].ToString();
        }

        [Given(@"the password to check is")]
        public void GivenThePasswordToCheckIs(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            passwordToCheck = row[0].ToString();
        }


        [Given(@"The email is")]
        public void GivenTheEmailIs(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            email = row[0].ToString();
        }

        [Given(@"The id is")]
        public void GivenTheIdIs(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            id = Convert.ToInt32(row[0]);
        }

        [When(@"The password is updated")]
        public void WhenThePasswordIsUpdated(Table table)
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var row = table.Rows[0];
            var passwordForUser = row[0].ToString();

            var userRepository = new UserRepository(configuration, _logger.Object);

            // Act
            var response = userRepository.UpdateUserPassword(passwordForUser, id);
            boolResponse = response.Result;
        }

        [When(@"The game data is added to the database")]
        public void WhenTheGameDataIsAddedToTheDatabase()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var userRepository = new UserRepository(configuration, _logger.Object);

            // Act
            var response = userRepository.AddGameAnalysisData(accuracy, timetaken, difficulty, id, 1, explanation);
            boolResponse = response.Result;
        }

        [When(@"The users results are retrieved")]
        public void WhenTheUsersResultsAreRetrieved()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var userRepository = new UserRepository(configuration, _logger.Object);

            // Act
            var response = userRepository.GetGameResults(id);
            gamesList = response.Result;
        }



        [When(@"The video analysis data is added to the database")]
        public void WhenTheVideoAnalysisDataIsAddedToTheDatabase()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var userRepository = new UserRepository(configuration, _logger.Object);

            // Act
            var response = userRepository.AddVideoAnalysisData(videoName, id, weaknessPrediction);
            boolResponse = response.Result;
        }


        [Given(@"The user to be retrieved is")]
        public void GivenTheUserToBeRetrievedIsEqualToThis(Table table)
        {
            // Arrange
            var row = table.Rows[0];
            var emailForUser = row[0].ToString();
            var userNameForUser = row[1].ToString();
            var passwordForUser = row[2].ToString();
            var roleForUser = row[0].ToString();
            // When testing invalid data the email will be blank
            if (emailForUser.Equals("blank"))
            {
                user = new User
                {
                    Id = -1
                };
            }
            else
            {
              
                user = new User
                {
                    Id = 0,
                    Email = emailForUser,
                    UserName = userNameForUser,
                    Password = passwordForUser,
                    Role = roleForUser
                };
            } 
        }

        [When(@"The user is updated")]
        public void WhenTheUserIsUpdated(Table table)
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var row = table.Rows[0];
            var emailForUser = row[0].ToString();
            var userNameForUser = row[1].ToString();
            var passwordForUser = row[2].ToString();
            var roleForUser = row[0].ToString();

            var userRepository = new UserRepository(configuration, _logger.Object);

            userFromDb = new User
            {
                Id = id,
                Email = emailForUser,
                UserName = userNameForUser,
                Password = passwordForUser,
                Role = roleForUser
            };

            // Act
            var response = userRepository.UpdateUser(userFromDb);
            boolResponse = response.Result;
        }


        [When(@"The user is retrieved")]
        public void WhenTheUserIsRetrieved()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var userRepository = new UserRepository(configuration, _logger.Object);

            // Act
            var response = userRepository.GetUser(userName);
            userFromDb = response.Result;
        }

        [When(@"The user is retrieved by email")]
        public void WhenTheUserIsRetrievedByEmail()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var userRepository = new UserRepository(configuration, _logger.Object);

            // Act
            var response = userRepository.GetUserByEmail(email);
            userFromDb = response.Result;
        }

        [When(@"The password is checked")]
        public void WhenThePasswordIsChecked()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var userRepository = new UserRepository(configuration, _logger.Object);

            // Act
            boolResponse = userRepository.CheckIfPasswordMatches(user, userNameToCheck, passwordToCheck);
        }

        [When(@"The user is created")]
        public  void WhenTheUserIsCreated()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var userRepository = new UserRepository(configuration, _logger.Object);

            // Act
            var response =  userRepository.CreateUser(email, userName, password, role);
            boolResponse = response.Result;
        }

        [When(@"The user is retrieved by id")]
        public void WhenTheUserIsRetrievedById()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string> {
                {"DatabaseSettings:ConnectionString", "Server=localhost;Port=5432;Database=UsersDb;User Id=admin;Password=admin1234"},
            };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var userRepository = new UserRepository(configuration, _logger.Object);

            // Act
            var response = userRepository.GetUserById(id);
            userFromDb = response.Result;
        }


        [Then(@"The return should be true")]
        public void ThenTheReturnShouldBeTrue()
        {
            // Assert
            boolResponse.Should().Be(true);
        }

        [Then(@"The return should be false")]
        public void ThenTheReturnShouldBeFalse()
        {
            // Assert
            boolResponse.Should().Be(false);
        }


        [Then(@"The user returned should be correct")]
        public void ThenTheUserReturnedShouldBeCorrect()
        {
            // Assert
            userFromDb.Should().NotBeNull();
            userFromDb.Should().BeOfType<User>();
            userFromDb.Email.Should().Be(user.Email);
            userFromDb.UserName.Should().Be(user.UserName);
        }

        [Then(@"The list should have data")]
        public void ThenTheListShouldHaveData()
        {   
            // Assert
            gamesList.Should().NotBeNull();
            gamesList.Count.Should().BeGreaterThan(0);
        }

        [Then(@"The list should not have data")]
        public void ThenTheListShouldNotHaveData()
        {
            // Assert
            gamesList.Should().NotBeNull();
            gamesList.Count.Should().Be(0);
        }



        // Stopping the user db and removing it from containers
        [AfterTestRun]
        public static void TearDownUserDb()
        {
            RunCommand("docker stop userdb-test");

            RunCommand("docker rm userdb-test");
        }
    }
}
