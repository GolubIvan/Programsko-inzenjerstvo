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

        [HttpGet]
        public async Task<IActionResult> CheckUser()
        {
            string token = Request.Headers["token"].ToString() ?? "";
            if (token == "undefined" || token == "")        
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }

            //Console.WriteLine(token);
            _logger.LogInformation("Checking user with token: {Token}", token);
            
            string email = JWTGenerator.ParseGoogleJwtToken(token);
            List<KeyValuePair<Backend.Models.Zgrada, string>> zgrade = Backend.Models.Racun.getUserData(email);
            
            if(zgrade.Count == 0) return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });

            bool isAdmin = false;

            for (int i = 0; i < zgrade.Count; i++)
            {
                if (zgrade[i].Value == "Administrator")
                {
                    isAdmin = true;
                    break; 
                }
            }

            return Ok(new { email = email, admin = isAdmin,podaci = zgrade });

        }
    }
}
