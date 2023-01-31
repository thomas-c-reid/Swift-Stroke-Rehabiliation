using SwiftUserManagement.Domain.Entities;

namespace SwiftUserManagement.Application.Contracts.Persistence
{
    // Interface for connecting to the database and saving/ reading from it
    public interface IUserRepository 
    {
        Task<User>  GetUser(string userName);
        Task<User> GetUserByEmail(string email);
        Task<bool> CreateUser(string email, string userName, string password, string role);
        Task<bool> UpdateUser(User user);
        Task<bool> AddVideoAnalysisData(string videoName, int userId, string weaknessPrediction);
        Task<bool> AddGameAnalysisData(double accuracy, double timeTaken, int difficulty, int userId, int level, string explanation);
        Task<List<GameResultsWithDate>> GetGameResults(int userId);
        bool CheckIfPasswordMatches(User user, string userName, string password);
        Task<bool> UpdateUserPassword(string newPassword, int userId);
    }
}
