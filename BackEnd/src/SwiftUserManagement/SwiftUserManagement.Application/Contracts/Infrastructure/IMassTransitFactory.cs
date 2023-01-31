namespace SwiftUserManagement.Application.Contracts.Infrastructure
{
    using Microsoft.AspNetCore.Http;
    using SwiftUserManagement.Application.Features.Queries.GetGameResults;

    // Interface for connecting to the azure service bus or rabbitmq
    public interface IMassTransitFactory
    {
        Task<string> EmitGameAnalysis(List<GameResultWithDateVm> gameResults);

        Task<string> ReceiveGameAnalysis();

        Task<bool> EmitVideonalysis(IFormFile video);

        Task<string> ReceiveVideonalysis();
        Task<string> EmitGameResults(List<GameResultWithDateVm> gameResults);
        Task<string> ReceiveGameResults();
        Task<string> EmitCalculateGameDifficulty(List<GameResultWithDateVm> gameResults);
        Task<string> ReceiveGameDifficulty();
    }
}
