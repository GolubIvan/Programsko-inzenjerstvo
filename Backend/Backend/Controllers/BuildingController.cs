using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [Route("buildings")]
    public class BuildingController : Controller
    {
        private readonly ILogger<BuildingController> _logger;

        public BuildingController(ILogger<BuildingController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{buildingId}")]
        public IActionResult GetMeetingsForBuilding(int buildingId)
        {
            var token = Request.Headers["token"];
            if (token == "undefined")
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }
            //Console.WriteLine(token);
            _logger.LogInformation("Checking user with token: {Token}", token);

            string email = JWTGenerator.ParseGoogleJwtToken(token);
            List<KeyValuePair<Backend.Models.Zgrada, string>> zgrade = Backend.Models.Racun.getUserData(email);

            string uloga = "";
            foreach (var zgrada in zgrade)
            {
                if (zgrada.Key.zgradaId == buildingId)
                {
                    uloga = zgrada.Value;
                    break;
                }
            }

            List<Backend.Models.Meeting> meetings = Backend.Models.Meeting.getMeetingsForBuilding(buildingId);

            if (meetings == null)
            {
                return NotFound(new { error = "No meetings found", message = "No meetings found for the specified building." });
            }

            return Ok(new { buildingId = buildingId, role = uloga, meetings = meetings });
        }
    }
}