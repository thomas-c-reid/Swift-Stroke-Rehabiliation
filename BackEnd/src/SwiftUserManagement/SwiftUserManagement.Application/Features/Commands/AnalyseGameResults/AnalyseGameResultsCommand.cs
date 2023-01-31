using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Commands.AnalyseGameResults
{
    // Command for analysing game results
    public class AnalyseGameResultsCommand : IRequest<string>
    {
        public int User_Id { get; set; }
        public string UserName { get; set; } = "";
        public double accuracy { get; set; }
        public double timeTaken { get; set; }
        public int level { get; set; }
        public int difficulty { get; set; }
    }
}
