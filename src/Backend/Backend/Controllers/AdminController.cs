using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Backend.Controllers
{
    [Route("admin")]
    public class AdminController : Controller
    {
        private readonly ILogger<AdminController> _logger;

        public AdminController(ILogger<AdminController> logger)
        {
            _logger = logger;
        }

        [HttpPost("create")]
        public async Task<IActionResult> crateUser([FromBody] Backend.Models.LoginRequest loginRequest)
        {
            var password = loginRequest.Password;
            var email = loginRequest.Email;
            var role = loginRequest.Role;
            var zgrada = loginRequest.Zgrada;
            var username = loginRequest.Username;

            if (!Backend.Models.Administrator.addUser(email, username, password, role, zgrada))
            {
                return BadRequest(new { error = "Error", message = "Can't create that user." });
            }

            return Ok();
        }

    }
}
