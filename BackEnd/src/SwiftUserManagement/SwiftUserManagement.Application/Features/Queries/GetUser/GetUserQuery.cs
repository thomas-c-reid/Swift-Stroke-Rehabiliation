using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.GetUser
{
    // Query for retrieveing a users details
    public class GetUserQuery : IRequest<UserVm>
    {
        public string UserName { get; set; }

        public GetUserQuery(string userName)
        {
            this.UserName = userName;
        }
    }
}
