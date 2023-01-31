using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using SwiftUserManagement.Application.Contracts.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Commands.ChangePassword
{
    // The handler for changing the password for a given user in the database
    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, string>
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<ChangePasswordCommandHandler> _logger;
        private readonly IMapper _mapper;

        public ChangePasswordCommandHandler(IUserRepository userRepository, ILogger<ChangePasswordCommandHandler> logger, IMapper mapper)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<string> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            // Checking if the user exists in the database
            var user = await _userRepository.GetUser(request.UserName);
            if (user.Id == -1)
            {
                return "Unauthorised";
            }

            // Checking if the old password matches the password in the database
            var response =  _userRepository.CheckIfPasswordMatches(user, request.UserName, request.Password);
            if (response == false)
            {
                return "Unauthorised";
            }
  
            // Updating the password to the new password
            var changedPassword = await _userRepository.UpdateUserPassword(request.NewPassword, user.Id);
           
            if(changedPassword)
            {
                return "Successfully changed password";
            }
            return "An error has occured when changing the password";
        }
    }
}
