using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Npgsql;
using SwiftUserManagement.Application.Contracts.Persistence;
using SwiftUserManagement.Domain.Entities;

namespace SwiftUserManagement.Infrastructure.Persistence
{
    public class UserRepository : IUserRepository
    {
        // Dependency injection for the configuration to get the postgresql connection string
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserRepository> _logger;

        // Constructor for the user repository
        public UserRepository(IConfiguration configuration, ILogger<UserRepository> logger)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // Creating a new user and adding them into the database
        public async Task<bool> CreateUser(string email, string userName, string password, string role)
        {
            // Connecting to the database
            using var connection = new NpgsqlConnection
                (_configuration["DatabaseSettings:ConnectionString"]);
            await connection.OpenAsync();

            _logger.LogInformation("Saving new user to the database");

            // Preparing the statement
            var cmd = new NpgsqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = $"INSERT INTO users(email, userName, password, role) VALUES(@email, @username, @password, @role);";
            var Email = cmd.Parameters.Add("email", NpgsqlTypes.NpgsqlDbType.Varchar);
            Email.Value = email;
            var UserName = cmd.Parameters.Add("username", NpgsqlTypes.NpgsqlDbType.Varchar);
            UserName.Value = userName;
            var Password = cmd.Parameters.Add("password", NpgsqlTypes.NpgsqlDbType.Varchar);
            Password.Value = password;
            var Role = cmd.Parameters.Add("role", NpgsqlTypes.NpgsqlDbType.Varchar);
            Role.Value = role;
            await cmd.PrepareAsync();

            // Executing the statement
            var affected = await cmd.ExecuteNonQueryAsync();

            // Closing the connection with the database
            await connection.CloseAsync();

            // If no rows have been affected then 0 is returned
            if (affected == 0)
            {
                return false;
            }

            return true;
        }

        // Retreiving a user from the database
        public async Task<User> GetUser(string userName)
        {
            using var connection = new NpgsqlConnection
                (_configuration["DatabaseSettings:ConnectionString"]);

            _logger.LogInformation("Retrieving user from the database");

            var user = await connection.QueryFirstOrDefaultAsync<User>
                ("SELECT * FROM Users WHERE UserName = @UserName", new { UserName = userName });

            if (user == null)
            {
                return new User
                {
                    Id = -1
                };
            }

            return user;
        }

        // Retrieving a user by Id
        public async Task<User> GetUserById(int userId)
        {
            using var connection = new NpgsqlConnection
                (_configuration["DatabaseSettings:ConnectionString"]);

            _logger.LogInformation("Retrieving user from the database");

            var user = await connection.QueryFirstOrDefaultAsync<User>
                ("SELECT * FROM Users WHERE id = @userId", new { userId = userId });

            if (user == null)
            {
                return new User
                {
                    Id = -1
                };
            }

            return user;
        }

        // Getting a user by email
        public async Task<User> GetUserByEmail(string email)
        {
            using var connection = new NpgsqlConnection
                (_configuration["DatabaseSettings:ConnectionString"]);

            _logger.LogInformation("Retrieving user from the database");

            var user = await connection.QueryFirstOrDefaultAsync<User>
                ("SELECT * FROM Users WHERE Email = @Email", new { Email = email });

            if (user == null)
            {
                return new User
                {
                    Id = -1,
                };
            }

            return user;
        }

        // Updating user details
        public async Task<bool> UpdateUser(User user)
        {
            // Connecting to the database
            using var connection = new NpgsqlConnection
                (_configuration["DatabaseSettings:ConnectionString"]);

            await connection.OpenAsync();

            _logger.LogInformation("Updating the user in the database");

            // Preparing the SQL Statement
            var cmd = new NpgsqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = $"UPDATE Users SET email=@email, userName=@userName, password=@password, role=@role WHERE id = @id";
            var Id = cmd.Parameters.Add("id", NpgsqlTypes.NpgsqlDbType.Integer);
            Id.Value = user.Id;
            var Email = cmd.Parameters.Add("email", NpgsqlTypes.NpgsqlDbType.Varchar);
            Email.Value = user.Email;
            var UserName = cmd.Parameters.Add("username", NpgsqlTypes.NpgsqlDbType.Varchar);
            UserName.Value = user.UserName;
            var Password = cmd.Parameters.Add("password", NpgsqlTypes.NpgsqlDbType.Varchar);
            Password.Value = user.Password;
            var Role = cmd.Parameters.Add("role", NpgsqlTypes.NpgsqlDbType.Varchar);
            Role.Value = user.Role;
            await cmd.PrepareAsync();

            // Executing the statement
            var affected = await cmd.ExecuteNonQueryAsync();

            // Closing the connection with the database
            await connection.CloseAsync();

            // If no rows have been affected then 0 is returned
            if (affected == 0)
            {
                return false;
            }

            return true;
        }

        // Checking if the password matches the one in the database
        public bool CheckIfPasswordMatches(User user, string userName, string password)
        {

            if (user.UserName == userName && BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        // Updating a user's password
        public async Task<bool> UpdateUserPassword(string newPassword, int userId)
        {
            // Opening the connection to the database
            using var connection = new NpgsqlConnection
                (_configuration["DatabaseSettings:ConnectionString"]);
            await connection.OpenAsync();

            _logger.LogInformation("Updating the users password in the database");

            // Preparing the SQL Statement
            var cmd = new NpgsqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = $"UPDATE users SET password = @password WHERE id = @id";
            var Id = cmd.Parameters.Add("id", NpgsqlTypes.NpgsqlDbType.Integer);
            Id.Value = userId;
            var Password = cmd.Parameters.Add("password", NpgsqlTypes.NpgsqlDbType.Varchar);
            Password.Value = newPassword;
            await cmd.PrepareAsync();

            // Executing the statement
            var affected = await cmd.ExecuteNonQueryAsync();

            // Closing the connection with the database
            await connection.CloseAsync();

            // If no rows have been affected then 0 is returned
            if (affected == 0)
            {
                return false;
            }

            return true;
        }

        // Adding video analysis data to the database for a user
        public async Task<bool> AddVideoAnalysisData(string videoName, int userId, string weaknessPrediction)
        {
            // Connecting to the database
            using var connection = new NpgsqlConnection
                (_configuration["DatabaseSettings:ConnectionString"]);
            await connection.OpenAsync();

            // Checking that a user exists in the database
            var user = await GetUserById(userId);

            // Returning false if the user doesn't exist in the database
            if(user.Id == -1)
            {
                return false;
            }

            _logger.LogInformation($"Adding video analysis data for userID {userId} in database");

            // Preparing the SQL Statement
            var cmd = new NpgsqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = $"INSERT INTO videos(user_id, video_name, weakness_prediction) VALUES(@user_id, @video_name, @weakness_prediction)";
            var Id = cmd.Parameters.Add("user_id", NpgsqlTypes.NpgsqlDbType.Integer);
            Id.Value = userId;
            var Video_Name = cmd.Parameters.Add("video_name", NpgsqlTypes.NpgsqlDbType.Varchar);
            Video_Name.Value = videoName;
            var Weakness_Prediction = cmd.Parameters.Add("weakness_prediction", NpgsqlTypes.NpgsqlDbType.Text);
            Weakness_Prediction.Value = weaknessPrediction;
            await cmd.PrepareAsync();

            // Executing the statement
            var affected = await cmd.ExecuteNonQueryAsync();

            // Closing the connection with the database
            await connection.CloseAsync();

            // If no rows have been affected then 0 is returned
            if (affected == 0)
            {
                return false;
            }

            return true;
        }

        // Adding game analysis data to the database for a user
        public async Task<bool> AddGameAnalysisData(double accuracy, double timeTaken, int difficulty, int userId, int level, string explanation)
        {
            // Opening the connection to the database
            using var connection = new NpgsqlConnection
                (_configuration["DatabaseSettings:ConnectionString"]);
            await connection.OpenAsync();

            // Checking that a user exists in the database
            var user = await GetUserById(userId);

            // Returning false if the user doesn't exist in the database
            if (user.Id == -1)
            {
                _logger.LogInformation($"The userID {userId} was not found in the database");
                return false;
                
            }

            // Returning false if the difficulty is invalid
            if(difficulty < 0 || difficulty > 100)
            {
                _logger.LogInformation($"The difficulty is invalid");
                return false;
            }

            _logger.LogInformation($"Adding game analysis data for userID {userId} in database");

            // Preparing the SQL Statement
            var cmd = new NpgsqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = $"INSERT INTO gamescores(user_id, level, accuracy, timetaken, difficulty, dateaddedtodb, explanation) VALUES(@user_id, @level, @accuracy, @timetaken, @difficulty, @dateaddedtodb, @explanation)";
            var Id = cmd.Parameters.Add("user_id", NpgsqlTypes.NpgsqlDbType.Integer);
            Id.Value = userId;
            var Level = cmd.Parameters.Add("level", NpgsqlTypes.NpgsqlDbType.Integer);
            Level.Value = level;
            var Accuracy = cmd.Parameters.Add("accuracy", NpgsqlTypes.NpgsqlDbType.Integer);
            Accuracy.Value = accuracy;
            var TimeTaken = cmd.Parameters.Add("timetaken", NpgsqlTypes.NpgsqlDbType.Integer);
            TimeTaken.Value = timeTaken;
            var Difficulty = cmd.Parameters.Add("difficulty", NpgsqlTypes.NpgsqlDbType.Integer);
            Difficulty.Value = difficulty;
            var DateAddedToDb = cmd.Parameters.Add("dateaddedtodb", NpgsqlTypes.NpgsqlDbType.Varchar);
            DateAddedToDb.Value = DateTime.Now.ToString();
            var Explanation = cmd.Parameters.Add("explanation", NpgsqlTypes.NpgsqlDbType.Varchar);
            Explanation.Value = explanation;
            await cmd.PrepareAsync();

            // Executing the statement
            var affected = await cmd.ExecuteNonQueryAsync();

            // Closing the connection with the database
            await connection.CloseAsync();

            // If no rows have been affected then 0 is returned
            if (affected == 0)
            {
                return false;
            }

            return true;
        }

        // Retrieving game data for a user
        public async Task<List<GameResultsWithDate>> GetGameResults(int userId)
        {
            using var connection = new NpgsqlConnection
                (_configuration["DatabaseSettings:ConnectionString"]);

            // Checking that a user exists in the database
            var user = await GetUserById(userId);

            // Returning an empty list if the user doesn't exist in the database
            if (user.Id == -1)
            {
                var gameList = new List<GameResultsWithDate>();
                return gameList;
            }

            _logger.LogInformation($"Retrieving game results for userID {userId}");

            var gameResults = await connection.QueryAsync<GameResultsWithDate>
                 ("SELECT * FROM GameScores WHERE User_Id = @User_Id;", new { User_Id = Convert.ToInt32(userId) });

            _logger.LogInformation($"Game Results: " + gameResults);

            return gameResults.ToList();
        }
    }
}
