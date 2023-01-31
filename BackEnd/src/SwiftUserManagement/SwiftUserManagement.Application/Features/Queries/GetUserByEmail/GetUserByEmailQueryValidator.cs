using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftUserManagement.Application.Features.Queries.GetUserByEmail
{
    public class GetUserByEmailQueryValidator : AbstractValidator<GetUserByEmailQuery>
    {
        public GetUserByEmailQueryValidator()
        {
            RuleFor(user => user.email)
                .NotEmpty().WithMessage("The email can't be empty")
                .NotNull().WithMessage("The email can't be null")
                .EmailAddress().WithMessage("The email has to be in the correct format of John@mail.com");
        }
    }
}
