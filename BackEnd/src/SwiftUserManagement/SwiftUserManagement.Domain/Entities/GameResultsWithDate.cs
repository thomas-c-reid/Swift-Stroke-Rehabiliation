using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Domain.Entities
{
    // Entity which will be returned to the user when they try to retrieve game scores
    public class GameResultsWithDate
    {
        public int User_Id { get; set; }
        public int accuracy { get; set; }
        public int timeTaken { get; set; }
        public int level { get; set; }
        public string explanation { get; set; } = "";
        public int difficulty { get; set; }
        public string DateAddedToDb { get; set; } = "";

        // Constructor to initialise the GameResultsWithDate entity
        public GameResultsWithDate(int user_Id, int accuracy, int timeTaken, int level, string explanation, int difficulty, string dateAddedToDb)
        {
            User_Id = user_Id;
            this.accuracy = accuracy;
            this.timeTaken = timeTaken;
            this.level = level;
            this.explanation = explanation ?? throw new ArgumentNullException(nameof(explanation));
            this.difficulty = difficulty;
            DateAddedToDb = dateAddedToDb ?? throw new ArgumentNullException(nameof(dateAddedToDb));
        }

        public GameResultsWithDate() : base() { }

    }
}
