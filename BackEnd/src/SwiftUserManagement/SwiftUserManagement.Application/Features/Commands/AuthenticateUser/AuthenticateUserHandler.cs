using AutoMapper;
using MediatR;
using SwiftUserManagement.Application.Contracts.Infrastructure;

namespace SwiftUserManagement.Application.Features.Commands.AuthenticateUser
{
    // Handling the authenticate user command, checking if the user exists within the database and sending back a token if the email
    // and passowrd combination is correct
    public class AuthenticateUserHandler : IRequestHandler<AuthenticateUserCommand, TokenVM>
    {
        private readonly IJWTManagementFactory _jwtManagementRepository;
        private readonly IMapper _mapper;

        public AuthenticateUserHandler(IJWTManagementFactory jwtManagementRepository, IMapper mapper)
        {
            _jwtManagementRepository = jwtManagementRepository ?? throw new ArgumentNullException(nameof(jwtManagementRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<TokenVM> Handle(AuthenticateUserCommand request, CancellationToken cancellationToken)
        {
            var token = await _jwtManagementRepository.Authenticate(request.Email, request.Password);
            if(token.Token == "Unauthorized")
            {
                return null;
            }

            return _mapper.Map<TokenVM>(token);
        }
    }
}
