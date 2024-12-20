using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [Route("meetings")]
    public class MeetingController : Controller
    {
        private readonly ILogger<MeetingController> _logger;

        public MeetingController(ILogger<MeetingController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{meetingId}")]
        public IActionResult GetMeeting(int meetingId)
        {
            Backend.Models.Meeting meeting = Backend.Models.Meeting.getMeeting(meetingId);

            if (meeting == null)
            {
                return NotFound(new { error = "Meeting not found", message = "Meeting with the specified ID not found." });
            }

            return Ok(new { meetingId = meetingId, meeting = meeting });
        }
        
    }
}