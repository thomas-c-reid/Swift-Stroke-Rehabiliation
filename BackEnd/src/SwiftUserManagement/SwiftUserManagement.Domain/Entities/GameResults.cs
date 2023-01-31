

namespace SwiftUserManagement.Domain.Entities
{
    // Entity which will hold the result from the game
    public class GameResults
    {
        public int accuracy { get; set; }
        public int timeTaken { get; set; }
        public int level { get; set; }
        public string explanation { get; set; } = "";
        public int difficulty { get; set; }

        // Constructor to initialise the GameResults entity
        public GameResults(int accuracy,int timeTaken,int difficulty,int level,string explanation)
        {
            this.accuracy = accuracy;
            this.timeTaken = timeTaken;
            this.level = level;
            this.explanation = explanation ?? throw new ArgumentNullException(nameof(explanation));
            this.difficulty = difficulty;
        }
    }
}
