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

            List<Backend.Models.Meeting> meetings = Backend.Models.Meeting.getMeetingsForBuilding(buildingId);

            if (meetings == null || meetings.Count == 0)
            {
                return NotFound(new { error = "No meetings found", message = "No meetings found for the specified building." });
            }

            return Ok(new { buildingId = buildingId, meetings = meetings });
        }
    }
}