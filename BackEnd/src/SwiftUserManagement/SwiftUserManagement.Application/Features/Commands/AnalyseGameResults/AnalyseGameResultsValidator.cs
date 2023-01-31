using FluentValidation;

namespace SwiftUserManagement.Application.Features.Commands.AnalyseGameResults
{
    public class AnalyseGameResultsValidator : AbstractValidator<AnalyseGameResultsCommand>
    {
        // Validating the game results analysis
        public AnalyseGameResultsValidator()
        {
            RuleFor(gameResults => gameResults.accuracy)
                .NotEmpty().WithMessage("Invalid game results")
                .NotNull().WithMessage("Invalid game results")
                .GreaterThanOrEqualTo(1).WithMessage("Accuracy has to be greater than or equal to 1")
                .LessThanOrEqualTo(100).WithMessage("Accuracy has to be less than or equal to 100");

            RuleFor(gameResults => gameResults.timeTaken)
                .NotEmpty().WithMessage("Invalid time taken")
                .NotNull().WithMessage("Invalid time taken")
                .GreaterThanOrEqualTo(0).WithMessage("Time taken has to be greater than 0");

            RuleFor(gameResults => gameResults.UserName)
                .NotEmpty().WithMessage("Username can't be empty")
                .NotNull().WithMessage("Username can't be null");

            RuleFor(gameResults => gameResults.User_Id)
                .NotEmpty().WithMessage("UserId can't be empty")
                .NotNull().WithMessage("UserId can't be null")
                .GreaterThan(0).WithMessage("UserId has to be greater than 0");

            RuleFor(gameResults => gameResults.difficulty)
                .NotEmpty().WithMessage("Difficulty can't be empty")
                .NotNull().WithMessage("Difficulty can't be null")
                .LessThanOrEqualTo(100).WithMessage("Difficulty has to be less than or equal to 100")
                .GreaterThanOrEqualTo(0).WithMessage("Difficulty has to be greater than or equal to 0");

            RuleFor(gameResults => gameResults.level)
                .NotEmpty().WithMessage("Level can't be empty")
                .NotNull().WithMessage("Level can't be null")
                .NotEqual(0).WithMessage("Level can't be zero");
        }
    }
}
