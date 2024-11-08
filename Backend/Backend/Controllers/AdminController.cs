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
        public async Task<IActionResult> crateUser()
        {
            var form = await Request.ReadFormAsync();
            var username = form["username"].ToString();
            var password = form["password"].ToString();
            var email = form["email"].ToString();
            var role = form["role"].ToString();
            var zgrada = form["zgrada"].ToString();

            if (!Backend.Models.Administrator.addUser(email, username, password, role, zgrada))
            {
                return BadRequest(new { error = "Error", message = "Can't create that user." });
            }

            return Ok();
        }

    }
}
