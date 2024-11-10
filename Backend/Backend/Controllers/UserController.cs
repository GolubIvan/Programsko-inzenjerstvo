using Backend.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("me")]
    public class UserController : Controller
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser([FromBody] Backend.Models.LoginRequest loginRequest)
        {
            var token = Request.Headers["token"];
            if (token == "undefined") {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." }); 
            }
            //Console.WriteLine(token);
            _logger.LogInformation("Checking user with token: {Token}", token);
            
            string email = JWTGenerator.ParseGoogleJwtToken(token);
            List<int> zgrade = Backend.Models.Racun.getUserData(email);
            
            if(zgrade.Count == 0) return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." }); 

            return Ok(new { email = email });

        }
    }
}
