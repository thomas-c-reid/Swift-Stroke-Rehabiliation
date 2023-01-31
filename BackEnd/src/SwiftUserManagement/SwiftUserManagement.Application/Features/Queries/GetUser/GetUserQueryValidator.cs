using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.GetUser
{
    // Validating the get user query class
    public class GetUserQueryValidator : AbstractValidator<GetUserQuery>
    {
        public GetUserQueryValidator()
        {
            RuleFor(user => user.UserName)
                .NotEmpty().WithMessage("The username can't be empty")
                .NotNull().WithMessage("The username can't be null");
        }
    }
}
