using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.CalculateDifficulty
{
    // Validating the calculate difficulty query
    public class CalculateDifficultyQueryValidator : AbstractValidator<CalculateDifficultyQuery>
    {
        public CalculateDifficultyQueryValidator()
        {
            RuleFor(user => user.UserName)
                .NotEmpty().WithMessage("Username is required")
                .NotNull().WithMessage("Username is required")
                .NotEqual("").WithMessage("Username is required")
                .NotEqual(" ").WithMessage("Username is required");

            RuleFor(user => user.User_Id)
                .NotEmpty().WithMessage("UserId can't be empty")
                .NotNull().WithMessage("UserId can't be null")
                .GreaterThan(0).WithMessage("UserId has to be greater than 0");
        }
    }
}
