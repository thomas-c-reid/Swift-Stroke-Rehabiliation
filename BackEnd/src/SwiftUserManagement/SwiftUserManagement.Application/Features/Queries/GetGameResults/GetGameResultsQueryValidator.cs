using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.GetGameResults
{
    // Validating the get game results query
    public class GetGameResultsQueryValidator : AbstractValidator<GetGameResultsQuery>
    {
        public GetGameResultsQueryValidator()
        {
            RuleFor(user => user.UserName)
                .NotEmpty().WithMessage("The username can't be empty")
                .NotNull().WithMessage("The username can't be null");

            RuleFor(gameResults => gameResults.User_Id)
                .NotEmpty().WithMessage("UserId can't be empty")
                .NotNull().WithMessage("UserId can't be null")
                .GreaterThan(0).WithMessage("UserId has to be greater than 0");

        }
    }
}
