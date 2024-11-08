using Backend.Models;
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
        public IActionResult LogIn()
        {
            Request.Headers.TryGetValue("username", out var username);
            Request.Headers.TryGetValue("password", out var password);
            Request.Headers.TryGetValue("email", out var email);
            
            List<int> zgrade = Backend.Models.Racun.getUserData(email);
            if(zgrade.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 
            if(!Backend.Models.Racun.checkPassword(email, password)) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." });
            
            string token = JWTGenerator.GenerateJwt(email);
            string role = Backend.Models.User.getRole(email, zgrade[0]);

            return Ok(new { token = token, role = role });

        }

        [HttpPost("google")]
        public IActionResult LogInGoogle()
        {
            Request.Headers.TryGetValue("token", out var token);

            string email = JWTGenerator.ParseGoogleJwtToken(token);
            List<int> zgrade = Backend.Models.Racun.getUserData(email);
            
            if(zgrade.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 

            string role = Backend.Models.User.getRole(email, zgrade[0]);

            return Ok(new { token = token, role = role });

        }
    }
}
