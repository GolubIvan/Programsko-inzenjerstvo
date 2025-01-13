using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Backend.Controllers
{
    [Route("api")]
    public static class APIController : Controller
    {
        [HttpPost("")]
        public IActionResult Test([FromBody] MeetingRequest meetingRequest)
        {
            string apiKey = Request.Headers["apiKey"].ToString() ?? "";
       
            if (token == "undefined" || token == "")        //postoji token
            {
                return Unauthorized(new { error = "Invalid API key", message = "The API key is invalid or has expired." });
            }

            if (meetingRequest == null)                     //postoji meeting
            {
                return BadRequest(new { error = "Invalid data", message = "Meeting data required." });
            }
            
            try
            {
                MeetingRequest.AddMeeting(meetingRequest, 0);
                return Created(new { message = "Meeting has been added." });
            }
            catch (Exception ex) {
                Console.WriteLine(ex);
                return BadRequest(new { error = "Invalid data", message = "Failed to add the meeting." });
            }
        }
    }
}