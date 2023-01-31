using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftUserManagement.Application.Features.Commands.AnalyseGameResults;
using SwiftUserManagement.Application.Features.Commands.AnalyseVideoResults;
using SwiftUserManagement.Application.Features.Commands.AuthenticateUser;
using SwiftUserManagement.Application.Features.Commands.ChangePassword;
using SwiftUserManagement.Application.Features.Commands.CreateUser;
using SwiftUserManagement.Application.Features.Queries.CalculateDifficulty;
using SwiftUserManagement.Application.Features.Queries.GetGameResults;
using SwiftUserManagement.Application.Features.Queries.GetUser;
using SwiftUserManagement.Application.Features.Queries.GetUserByEmail;
using SwiftUserManagement.Domain.Entities;
using System.Net;
using System.Text.Json;

namespace SwiftUserManagement.API.Controllers
{
    // User management controller


    // !!!!!!!!!!!!!!! A query is retrieving a value from the database                                                                      !!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!! A command is writing to the database                                                                                 !!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!! Sending a result to mediator means calling the handler for that query/ command (Code is in application/features/)    !!!!!!!!!!!!!!!
    [Route("api/[controller]")]
    [ApiController]
    public class SwiftUserManagementController : ControllerBase
    {

        // Dependency injection for mediator to send the requests to the correct handler
        private readonly IMediator _mediator;
        private readonly ILogger<SwiftUserManagementController> _logger;

        public SwiftUserManagementController(IMediator mediator, ILogger<SwiftUserManagementController> logger)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // Creating a user in the database
        [AllowAnonymous]
        [HttpPost("createUser", Name = "CreateUser")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<ActionResult> createUser([FromBody] CreateUserCommand user)
        {
            // Validating the command
            CreateUserCommandValidator validator = new CreateUserCommandValidator();
            var validationResult = validator.Validate(user);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult });
            }

            // Sending the result to mediator
            var result = await _mediator.Send(user);

            // If the result is -1 the user already exists
            if (result == -1)
                return BadRequest(new { Message = "User invalid/already exists" });

            return Ok($"User: {user.UserName} successfully created");
         }

        // Retreiving a user from the database
        [HttpGet("username/{userName}", Name = "GetUser")]
        [Authorize]
        [ProducesResponseType(typeof(User), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public ActionResult<User> getUser(string userName)
        {
            // Generating the get user query
            var query = new GetUserQuery(userName);

            // Validating the query
            GetUserQueryValidator validator = new GetUserQueryValidator();
            var validationResult = validator.Validate(query);
            if(!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult });
            }

            // Sending the query to mediator
            var user = _mediator.Send(query);

            // If the user ID is -1 then the user was not found
            if (user.Result.Id == -1) return BadRequest(new { Message = "User not found" });
               
            return Ok(user.Result);
        }

        // Retrieving a user from the database by email
        [HttpGet("email/{email}", Name = "GetUserByEmail")]
        [Authorize]
        [ProducesResponseType(typeof(User), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public ActionResult<User> getUserByEmail(string email)
        {
            // Creating the query
            var query = new GetUserByEmailQuery(email);

            // Validating the query
            GetUserByEmailQueryValidator validator = new GetUserByEmailQueryValidator();
            var validationResult = validator.Validate(query);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult });
            }

            // Sending the query
            var user = _mediator.Send(query);

            // If the user ID is -1 then the user was not found
            if (user.Result.Id == -1) return BadRequest(new { Message = "User not found" });

            return Ok(user.Result);
        }

        // Letting the client know it is connected to the server
        [AllowAnonymous]
        [HttpGet("pingServer", Name = "Ping")]
        public string pingServer()
        {
            return "You are connected to the server";
        }

        // Authenticating a user and returning a JWT token
        [AllowAnonymous]
        [HttpPost("auth", Name = "Authenticate")]
        [ProducesResponseType(typeof(Tokens), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        public async Task<ActionResult<Tokens>> Authenticate(AuthenticateUserCommand tokenRequest)
        {
            // Validating the command
            var validator = new AuthenticateUserValidator();
            var validationResult = validator.Validate(tokenRequest);
            if(!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult });
            }

            // Sending the command
            var token = await _mediator.Send(tokenRequest);

            // If the value returned is null then the user is unauthorised to access the system
            if (token == null)
            {
                return Unauthorized();
            }

            return Ok(token);
        }

        // Retrieving the last five game results for a user from the database
        // Mediator returns an empty result with accuracy as -1 if the user doesn't exist
        [Authorize]
        [HttpPost("retrieveGameResults", Name = "retrieveGameResults")]
        [ProducesResponseType(typeof(List<GameResultsWithDate>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<ActionResult<string>> GetGameResults([FromBody] GetGameResultsQuery gameResultsQuery)
        {
            // Validating the query
            var validator = new GetGameResultsQueryValidator();
            var validationResult = validator.Validate(gameResultsQuery);
            if(!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult });
            }

            // Checking if the user exists
            var query = new GetUserQuery(gameResultsQuery.UserName);
            var user = await _mediator.Send(query);
            if (user == null)
                return BadRequest(new { Message = "User doesn't exist" });

            // Sending the game results query to mediator
            var gameData = await _mediator.Send(gameResultsQuery);

            // If there is game data it will be returned, if there isn't any game data then an empty list will be returned
            return Ok(gameData);
        }

        // Emitting the game results for analysis by the python file
        [Authorize]
        [HttpPost("analyseGameScore", Name = "AnalyseGameScore")]
        [ProducesResponseType(typeof(bool), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<ActionResult<string>> AnalyseGameResults([FromBody] AnalyseGameResultsCommand gameResults)
        {
            // Validating the command
            var validator = new AnalyseGameResultsValidator();
            var validationResult = validator.Validate(gameResults);
            if(!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult });
            }    
        
            // Getting the user so that the user id can be passed through
            var query = new GetUserQuery(gameResults.UserName);
            var user = await _mediator.Send(query);

            // If the user not found return bad request
            if(user == null) 
                return BadRequest(new { Message = "User doesn't exist"});

            gameResults.User_Id = user.Id;
            
            // Sending the game results for analysis
            var receivedData = await _mediator.Send(gameResults);

            // If user is not found, bad request is sent out
            if(receivedData == "User not found")
                return BadRequest(new { Message = "User not found" });


            return Ok(receivedData);
        }

        // Receiving video data from the React client
       [Authorize]
       [HttpPost("analyseVideo", Name = "AnalyseVideo")]
       [ProducesResponseType((int)HttpStatusCode.OK)]
       [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<ActionResult<string>> AnalyseVideoResult([FromForm] List<IFormFile> videoData, string userName)
        {
            // Checking if the user exists in the database
            var query = new GetUserQuery(userName);
            var user = _mediator.Send(query);

            if (user == null) return BadRequest(new { Message = "User not found" });

            // Send the first file in the array for analysis
            var videoQuery = new AnalyseVideoResultsCommand(videoData, userName, user.Id);

            // Validating the command to be sent
            var validator = new AnalyseVideoResultsValidator();
            var validationResult = validator.Validate(videoQuery);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult });
            }

            // Sending the result to mediator
            var response = await _mediator.Send(videoQuery);

            // If there was an error return badrequest
            if (response == "Not able to add data into database")
                return BadRequest(new { Message = "Not able to add data into database" });

            // If the request has timed out return bad request
            if (response == "The request has timed out")
                return BadRequest(new { Message = "The request has timed out" });

            return Ok($"File analysed: " +
                $"{response}");
        }

        // Calculating the difficulty for the user in the next game they will play
        [Authorize]
        [HttpPost("calculateDifficulty", Name = "CalculateDifficulty")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<ActionResult<string>> CalculateDifficulty([FromBody] CalculateDifficultyQuery query)
        {
            // Validating the query
            var validator = new CalculateDifficultyQueryValidator();
            var validationResult = validator.Validate(query);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult });
            }

            // Sending the query to the mediator handler
            var response = await _mediator.Send(query);

            return Ok(response);
        }

        // Letting a user update their password if they know their current password
        [Authorize]
        [HttpPut("changePassword", Name = "ChangePassword")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<ActionResult<string>> ChangePassword([FromBody] ChangePasswordCommand command)
        {
            // Validating the command
            var validator = new ChangePasswordCommandValidator();
            var validationResult = validator.Validate(command);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult });
            }

            // Sending the command to the mediator handler
            var response = await _mediator.Send(command);

            _logger.LogInformation("User changing password: " + "{\"Message\" : \"" + response + "\"}");

            return Ok("{\"Message\" : \"" + response + "\"}");
        }

    }
}
