using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Commands.AuthenticateUser
{
    // Command for authenticating the user
    public class AuthenticateUserCommand : IRequest<TokenVM>
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
