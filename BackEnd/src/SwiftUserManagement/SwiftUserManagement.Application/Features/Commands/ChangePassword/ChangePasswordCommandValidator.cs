using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Commands.ChangePassword
{
    // Validator for the change password command
    public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
    {
        public ChangePasswordCommandValidator()
        {
            RuleFor(user => user.UserName)
                .NotEmpty().WithMessage("Username is required")
                .NotNull().WithMessage("Username is required")
                .NotEqual("").WithMessage("Username is required")
                .NotEqual(" ").WithMessage("Username is required");

            RuleFor(user => user.Password)
                .NotEmpty().WithMessage("Passowrd is required")
                .NotNull().WithMessage("Password is required")
                .NotEqual("").WithMessage("Password is required")
                .NotEqual(" ").WithMessage("Password is required");

            // Regex for the password ensures minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
            RuleFor(user => user.NewPassword)
                .NotEmpty().WithMessage("New passowrd is required")
                .NotNull().WithMessage("New password is required")
                .NotEqual("").WithMessage("New password is required")
                .NotEqual(" ").WithMessage("New password is required")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$").WithMessage("The password doesn't match the minimum requirements of minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character");
        }
    }
}
