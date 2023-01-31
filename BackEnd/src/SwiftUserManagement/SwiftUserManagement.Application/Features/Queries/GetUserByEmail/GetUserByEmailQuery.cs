using MediatR;
using SwiftUserManagement.Application.Features.Queries.GetUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.GetUserByEmail
{
    public class GetUserByEmailQuery : IRequest<UserVm>
    {
        public string email { get; set; }

        public GetUserByEmailQuery(string email)
        {
            this.email = email;
        }
    }
}
