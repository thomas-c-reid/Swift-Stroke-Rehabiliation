using AutoMapper;
using MediatR;
using SwiftUserManagement.Application.Contracts.Persistence;
using SwiftUserManagement.Application.Features.Queries.GetUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.GetUserByEmail
{
    public class GetUserByEmailQueryHandler : IRequestHandler<GetUserByEmailQuery, UserVm>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public GetUserByEmailQueryHandler(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<UserVm> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
        {
            var result = await _userRepository.GetUserByEmail(request.email);

            return _mapper.Map<UserVm>(result);
        }
    }
}
