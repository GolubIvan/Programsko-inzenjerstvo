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
            Console.WriteLine("Login request");
            var password = loginRequest.Password;
            var email = loginRequest.Email;
            Console.WriteLine("Email:" + email);

            if(!Backend.Models.Racun.checkPassword(email, password)) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." });
            
            List<KeyValuePair<int, string>> zgrade_uloge = Backend.Models.Racun.getUserData(email);
            if(zgrade_uloge.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 
            
            string token = JWTGenerator.GenerateJwt(email);

            return Ok(new { token = token, podaci = zgrade_uloge });

        }

        [HttpPost("google")]
        public async Task<IActionResult> LogInGoogle([FromBody] Backend.Models.LoginRequest loginRequest)
        {
            var token = loginRequest.Token;

            string email = JWTGenerator.ParseGoogleJwtToken(token);
            
            List<KeyValuePair<int, string>> zgrade_uloge = Backend.Models.Racun.getUserData(email);
            if(zgrade_uloge.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 
            
            return Ok(new { token = token, podaci = zgrade_uloge });
        }
    }
}
