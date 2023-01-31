using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.GetGameResults
{
    // Query class for retrieving the game results from the database
    public class GetGameResultsQuery : IRequest<string>
    {
        public string UserName { get; set; }
        public int User_Id { get; set; }

        public GetGameResultsQuery(string userName, int user_Id)
        {
            UserName = userName ?? throw new ArgumentNullException(nameof(userName));
            User_Id = user_Id;
        }
    }
}
