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
        public IActionResult crateUser()
        {
            Request.Headers.TryGetValue("username", out var username);
            Request.Headers.TryGetValue("password", out var password);
            Request.Headers.TryGetValue("email", out var email);
            Request.Headers.TryGetValue("role", out var role);
            Request.Headers.TryGetValue("zgrada", out var zgrada);

            Console.WriteLine("Username: " + username);
            Console.WriteLine("Password: " + password);
            Console.WriteLine("Email: " + email);
            Console.WriteLine("Role: " + role);
            Console.WriteLine("Zgrada: " + zgrada);


            if (!Backend.Models.Administrator.addUser(email, username, password, role, zgrada)) return BadRequest(new { error = "Error", message = "Can't create that user." });

            return Ok();
        }

    }
}
