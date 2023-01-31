using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SwiftUserManagement.Application.Contracts.Infrastructure;
using SwiftUserManagement.Application.Contracts.Persistence;
using SwiftUserManagement.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SwiftUserManagement.Infrastructure.Repositories
{
    // Concrete class for authenticating users using JWT
    public class JWTManagementFactory : IJWTManagementFactory
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<JWTManagementFactory> _logger;

        public JWTManagementFactory(IConfiguration configuration, IUserRepository userRepository, ILogger<JWTManagementFactory> logger)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // Code to see if a user matches, 
        public async Task<Tokens> Authenticate(string email, string password)
        {
           var foundUserFromDb = await _userRepository.GetUserByEmail(email);

           if(foundUserFromDb.Id == -1)
            {
                return new Tokens { Token = "Unauthorized" };
            }

            // If the user password and username don't match
            if (foundUserFromDb.Email == email && BCrypt.Net.BCrypt.Verify(password, foundUserFromDb.Password))
            {
                // Generate token
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenKey = Encoding.UTF8.GetBytes(_configuration["JWT:Key"]);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                  {
             new Claim(ClaimTypes.Name, email)
                  }),
                    Expires = DateTime.UtcNow.AddMinutes(10),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                _logger.LogInformation("Token created for user");

                return new Tokens { Token = tokenHandler.WriteToken(token) };
            }

            return new Tokens { Token = "Unauthorized" };

        }
    }
}
