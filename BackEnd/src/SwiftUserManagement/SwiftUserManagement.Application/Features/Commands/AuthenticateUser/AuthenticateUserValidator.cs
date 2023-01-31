using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Commands.AuthenticateUser
{
    // Validating the authenticate user command
    public class AuthenticateUserValidator : AbstractValidator<AuthenticateUserCommand>
    {
        public AuthenticateUserValidator()
        {
            // Doesn't need email and password checks as it's only checking with what is in the database
            RuleFor(user => user.Email)
                .NotEmpty().WithMessage("Email is required")
                .NotNull().WithMessage("Email is required");

            RuleFor(user => user.Password)
                .NotEmpty().WithMessage("Password is required")
                .NotNull().WithMessage("Password is required");
        }
    }
}
