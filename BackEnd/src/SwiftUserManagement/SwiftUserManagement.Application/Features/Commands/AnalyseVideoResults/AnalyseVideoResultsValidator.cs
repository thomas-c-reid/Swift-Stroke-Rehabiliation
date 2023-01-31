using FluentValidation;

namespace SwiftUserManagement.Application.Features.Commands.AnalyseVideoResults
{
    // Validating the analyse video results command
    public class AnalyseVideoResultsValidator : AbstractValidator<AnalyseVideoResultsCommand>
    {
        public AnalyseVideoResultsValidator()
        {
            RuleFor(video => video.VideoData.Count)
                .Equal(1).WithMessage("Please only send one video file");

            RuleFor(video => video.VideoData[0].ContentType)
                .Must(contentType => contentType.Contains("video"));

            RuleFor(user => user.UserName)
                .NotEmpty().WithMessage("Username must not be empty")
                .NotNull().WithMessage("Username must not be null");

            RuleFor(user => user.UserId)
                .NotEmpty().WithMessage("UserId can't be empty")
                .NotNull().WithMessage("UserId can't be null")
                .GreaterThan(0).WithMessage("UserId has to be greater than 0");
        }
    }
}
