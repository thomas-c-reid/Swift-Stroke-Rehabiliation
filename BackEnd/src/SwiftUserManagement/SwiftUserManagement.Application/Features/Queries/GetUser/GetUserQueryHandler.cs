using AutoMapper;
using MediatR;
using SwiftUserManagement.Application.Contracts.Persistence;

namespace SwiftUserManagement.Application.Features.Queries.GetUser
{
    // Handler for retrieving the user details from the database 
    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, UserVm>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public GetUserQueryHandler(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<UserVm> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var result = await _userRepository.GetUser(request.UserName);

            return _mapper.Map<UserVm>(result);
        }
    }
}
