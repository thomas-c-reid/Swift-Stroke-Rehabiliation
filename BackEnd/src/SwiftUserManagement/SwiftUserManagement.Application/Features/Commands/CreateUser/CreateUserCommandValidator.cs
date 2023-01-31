using FluentValidation;

namespace SwiftUserManagement.Application.Features.Commands.CreateUser
{
    public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
    {
        // Validating if the create user commadn has correct data
        public CreateUserCommandValidator()
        {
            // Validating that a username can not be blank
            RuleFor(user => user.UserName)
                .NotEmpty().WithMessage("Username is required")
                .NotNull().WithMessage("Username is required")
                .NotEqual("").WithMessage("Username is required")
                .NotEqual(" ").WithMessage("Username is required");

            // Validating that a password is not blank and isn't invalid
            // Regex for the password ensures minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
            RuleFor(user => user.Password)
                .NotEmpty().WithMessage("New passowrd is required")
                .NotNull().WithMessage("New password is required")
                .NotEqual("").WithMessage("New password is required")
                .NotEqual(" ").WithMessage("New password is required")
                .MinimumLength(8).WithMessage("The password has to be longer than eight characters")
                .Matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").WithMessage("The password needs to have an uppercase character, a number and a special character");

            // Validating that the email is correct
            RuleFor(user => user.Email)
                .NotEmpty().WithMessage("Email is required")
                .NotNull().WithMessage("Email is required")
                .EmailAddress().WithMessage("The email has to be a valid email address in the format of johndoe@mail.com");

            // Currently the only role is a user so it has to be User
            RuleFor(user => user.Role)
                .NotEmpty().WithMessage("Role is required")
                .NotNull().WithMessage("Role is required")
                .Equal("User").WithMessage("Role has to be User");
        }
    }
}
