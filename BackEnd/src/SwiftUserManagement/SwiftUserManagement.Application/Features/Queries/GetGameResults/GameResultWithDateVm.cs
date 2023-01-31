namespace SwiftUserManagement.Application.Features.Queries.GetGameResults
{
    // Virtual class for the game result with date class as the application does not have access to that class
    public class GameResultWithDateVm
    {
        public int User_Id { get; set; }
        public int accuracy { get; set; }
        public int timeTaken { get; set; }
        public int level { get; set; }
        public string explanation { get; set; } = "";
        public int difficulty { get; set; }
        public string DateAddedToDb { get; set; } = "";
    }
}