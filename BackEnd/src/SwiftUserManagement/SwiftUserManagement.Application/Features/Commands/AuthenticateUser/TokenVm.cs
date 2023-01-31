using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Commands.AuthenticateUser
{
    // Virtual class for the token as the application does not have access to the actual token class
    public class TokenVM
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
