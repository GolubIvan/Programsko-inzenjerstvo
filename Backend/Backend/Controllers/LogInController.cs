using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Backend.Controllers
{
    [Route("login")]
    public class LogInController : Controller
    {
        private readonly ILogger<LogInController> _logger;

        public LogInController(ILogger<LogInController> logger)
        {
            _logger = logger;
        }

        [HttpPost("normal")]
        public IActionResult LogIn()
        {
            Request.Headers.TryGetValue("username", out var username);
            Request.Headers.TryGetValue("password", out var password);
            Request.Headers.TryGetValue("email", out var email);
            
            string userID = Backend.Models.User.getUserData(email);
            if(!int.TryParse(userID, out int numUserID)) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 
            if(!Backend.Models.User.checkPassword(numUserID, password)) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." });
            
            string token = JWTGenerator.GenerateJwt(numUserID);

            return Ok(token);

        }
    }
}
