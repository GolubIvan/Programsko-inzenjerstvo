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

            if(!Backend.Models.Racun.checkPassword(email, password)) return Unauthorized(new { error = "Invalidd credentials", message = "The username or password you entered is incorrect." });
            
            List<KeyValuePair<Backend.Models.Zgrada, string>> zgrade_uloge = Backend.Models.Racun.getUserData(email);
            if(zgrade_uloge.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 
            foreach(var zgrada_uloga in zgrade_uloge){
                Console.WriteLine(zgrada_uloga);
            }
            string token = JWTGenerator.GenerateJwt(email);
            var podaci = zgrade_uloge.Select(zu => new { zgrada = new{address = zu.Key.address, zgradaId = zu.Key.zgradaId}, uloga = zu.Value});
            return Ok(new { token = token, podaci = podaci });

        }

        [HttpPost("google")]
        public async Task<IActionResult> LogInGoogle([FromBody] Backend.Models.LoginRequest loginRequest)
        {
            var token = loginRequest.Token;

            string email = JWTGenerator.ParseGoogleJwtToken(token);
            
            List<KeyValuePair<Backend.Models.Zgrada, string>> zgrade_uloge = Backend.Models.Racun.getUserData(email);
            if(zgrade_uloge.Count == 0) return Unauthorized(new { error = "Invalid credentials", message = "The username or password you entered is incorrect." }); 

            return Ok(new { token = token, podaci = zgrade_uloge });
        }
    }
}
