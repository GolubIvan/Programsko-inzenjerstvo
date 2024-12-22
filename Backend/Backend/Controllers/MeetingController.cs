using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Text;

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
        [HttpPost("delete/{meetingId}")]
        public IActionResult DeleteMeeting(int meetingId)
        {
            string token = Request.Headers["token"].ToString() ?? "";
            if (token == "undefined" || token == "")
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }

            string email = JWTGenerator.ParseGoogleJwtToken(token); //problematicno jer ce raditi i za istekle tokene
            //Console.WriteLine(email);
            List<KeyValuePair<Backend.Models.Zgrada, string>> zgrade = Backend.Models.Racun.getUserData(email);


            Backend.Models.Meeting meeting = Backend.Models.Meeting.getMeeting(meetingId);
            
            string uloga = "";
            
            foreach (var zgrada in zgrade)
            {
                if (zgrada.Key.zgradaId == meeting.zgradaId)
                {
                    uloga = zgrada.Value;
                    break;
                }
            }

            if (uloga == "Predstavnik")
            {
                if (meeting == null)
                {
                    return NotFound(new { error = "Meeting not found", message = "Meeting with the specified ID not found." });
                }
                bool isDeleted = Backend.Models.Meeting.deleteMeeting(meetingId);

                if (!isDeleted)
                {
                    return StatusCode(500, new { error = "Deletion failed", message = "Failed to delete the meeting." });
                }
                return Ok(new { message = "Meeting with the specified ID was deleted." });
            }
            return Unauthorized(new { error = "Invalid role", message = "The user role is not high enough." });
        }

    }
}