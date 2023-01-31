using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.CalculateDifficulty
{
    // Query class for calculating the difficulty
    public class CalculateDifficultyQuery : IRequest<string>
    {
        public string UserName { get; set; }
        public int User_Id { get; set; }

        public CalculateDifficultyQuery(string userName, int user_Id)
        {
            UserName = userName ?? throw new ArgumentNullException(nameof(userName));
            User_Id = user_Id;
        }
    }
}
