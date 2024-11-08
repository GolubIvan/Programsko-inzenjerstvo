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
        public async Task<IActionResult> LogIn()
        {
          var form = await Request.ReadFormAsync();
            var username = form["username"].ToString();
            var password = form["password"].ToString();
            var email = form["email"].ToString();

            List<int> zgrade = Backend.Models.Racun.getUserData(email);
            if(zgrade.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 
            if(!Backend.Models.Racun.checkPassword(email, password)) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." });
            
            string token = JWTGenerator.GenerateJwt(email);
            string role = Backend.Models.User.getRole(email, zgrade[0]);

            return Ok(new { token = token, role = role });

        }

        [HttpPost("google")]
        public async Task<IActionResult> LogInGoogle()
        {
            var form = await Request.ReadFormAsync();
            var token = form["token"].ToString();

            string email = JWTGenerator.ParseGoogleJwtToken(token);
            List<int> zgrade = Backend.Models.Racun.getUserData(email);
            
            if(zgrade.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 

            string role = Backend.Models.User.getRole(email, zgrade[0]);

            return Ok(new { token = token, role = role });

        }
    }
}
