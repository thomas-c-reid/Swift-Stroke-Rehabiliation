namespace SwiftUserManagement.Domain.Entities
{
    // Tokens entity class to be used to store JWT Tokens
    public class Tokens
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
