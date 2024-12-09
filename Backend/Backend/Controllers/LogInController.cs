using Backend.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> LogIn([FromBody] Backend.Models.LoginRequest loginRequest)
        {
            var password = loginRequest.Password;
            var email = loginRequest.Email;
            
            if(!Backend.Models.Racun.checkPassword(email, password)) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." });
            
            List<pair<int, string>> zgrade_uloge = Backend.Models.Racun.getUserData(email);
            if(zgrade_uloge.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 
            
            string token = JWTGenerator.GenerateJwt(email);

            return Ok(new { token = token, podaci = zgrade_uloge });

        }

        [HttpPost("google")]
        public async Task<IActionResult> LogInGoogle([FromBody] Backend.Models.LoginRequest loginRequest)
        {
            var token = loginRequest.Token;

            string email = JWTGenerator.ParseGoogleJwtToken(token);
            List<int> zgrade = Backend.Models.Racun.getUserData(email);
            
            if(zgrade.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The specified email does not have a valid Google account." }); 

            string role = Backend.Models.User.getRole(email, zgrade[0]);

            return Ok(new { token = token, role = role });

        }
    }
}
