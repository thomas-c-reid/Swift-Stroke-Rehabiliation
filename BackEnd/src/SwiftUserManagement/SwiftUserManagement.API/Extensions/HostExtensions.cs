using Npgsql;

namespace SwiftUserManagement.API.Extensions
{
    public static class HostExtensions
    {
        // Migrates the database and inserts dummy data into the new database
        public static IHost MigrateDatabase<TContext>(this IHost host, int? retry = 0)
        {
            if (retry == null)
            {
                retry = 0;
            }

            int retryForAvailability = retry.Value;

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var configuration = services.GetRequiredService<IConfiguration>();
                var logger = services.GetRequiredService<ILogger<TContext>>();

                try
                {
                    logger.LogInformation("Migrating PostgreSQL Database");

                    using var connection = new NpgsqlConnection
                        (configuration["DatabaseSettings:ConnectionString"]);
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
                    command.CommandText = $"INSERT INTO GameScores(User_Id, Level, Accuracy, TimeTaken, Difficulty, Explanation, DateAddedToDb) VALUES(1, 1, 52, 36, 70, 'No stroke symptoms', '{DateTime.Now.AddDays(-3)}');";
                    command.ExecuteNonQuery();
                    command.CommandText = $"INSERT INTO GameScores(User_Id, Level, Accuracy, TimeTaken, Difficulty, Explanation, DateAddedToDb) VALUES(1, 1, 85, 20, 60, 'No stroke symptoms', '{DateTime.Now.AddDays(-4)}');";
                    command.ExecuteNonQuery();
                    command.CommandText = $"INSERT INTO GameScores(User_Id, Level, Accuracy, TimeTaken, Difficulty, Explanation, DateAddedToDb) VALUES(1, 1, 72, 28, 80, 'No stroke symptoms', '{DateTime.Now.AddDays(-5)}');";
                    command.ExecuteNonQuery();
                    command.CommandText = $"INSERT INTO GameScores(User_Id, Level, Accuracy, TimeTaken, Difficulty, Explanation, DateAddedToDb) VALUES(1, 1, 57, 22, 90, 'No stroke symptoms', '{DateTime.Now.AddDays(-6)}');";
                    command.ExecuteNonQuery();

                    logger.LogInformation("Migrated postgresql database.");

                    connection.Close();
                }
                catch (NpgsqlException ex)
                {
                    logger.LogError(ex, "An error occured while migrating the PostgreSQL database");

                    if (retryForAvailability < 50)
                    {
                        retryForAvailability++;
                        System.Threading.Thread.Sleep(2000);
                        MigrateDatabase<TContext>(host, retryForAvailability);
                    }
                }
            }

            return host;
        }
    }
}
