using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Commands.AnalyseVideoResults
{
    // Analyse video results command for sending to rabbitmq, and saving the analysis result to the database
    public class AnalyseVideoResultsCommand : IRequest<string>
    {
        public List<IFormFile> VideoData { get; set; }
        public string UserName { get; set; }
        public int UserId { get; set; }

        public AnalyseVideoResultsCommand(List<IFormFile> videoData, string userName, int id)
        {
            this.VideoData = videoData;
            this.UserName = userName;
            this.UserId = id;
        }
    }
}
