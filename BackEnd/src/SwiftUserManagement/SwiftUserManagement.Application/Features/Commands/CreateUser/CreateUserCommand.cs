using MediatR;

namespace SwiftUserManagement.Application.Features.Commands.CreateUser
{
    // Command class for creating a user in the database
    public class CreateUserCommand : IRequest<int>
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
