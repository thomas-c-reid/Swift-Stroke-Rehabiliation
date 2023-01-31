using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using SwiftUserManagement.Application.Contracts.Persistence;
using SwiftUserManagement.Domain.Entities;

namespace SwiftUserManagement.Application.Features.Commands.CreateUser
{
    // Handler for creating a user in the database
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, int>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<CreateUserCommandHandler> _logger;

        public CreateUserCommandHandler(IUserRepository userRepository, IMapper mapper, ILogger<CreateUserCommandHandler> logger)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            // Check if user already exists in database
            var userInDb = await _userRepository.GetUserByEmail(request.Email);
            if(userInDb.Id != -1)
            {
                return -1;
            }
            
            // Map to user type
            var user = _mapper.Map<User>(request);
            // Create the user in the database
            var result = await _userRepository.CreateUser(user.Email, user.UserName, user.Password, user.Role);

            if (result == false)
                return -1;

            return 1;
        }
    }
}
