using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Commands.ChangePassword
{
    // Command for changing the password in the database for a given user
    public class ChangePasswordCommand : IRequest<string>
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }

        public ChangePasswordCommand(string userName, string password, string newPassword)
        {
            this.UserName = userName ?? throw new ArgumentNullException(nameof(userName));
            this.Password = password ?? throw new ArgumentNullException(nameof(password));
            this.NewPassword = newPassword ?? throw new ArgumentNullException(nameof(newPassword));
        }
    }
}
