using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Npgsql;
using System;
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

        [HttpPost("create")]
        public IActionResult CreateMeeting([FromBody] MeetingRequest meetingRequest)
        {
            
            string token = Request.Headers["token"].ToString() ?? "";
       
            if (token == "undefined" || token == "")        //postoji token
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }

            if (meetingRequest == null)                     //postoji meeting
            {
                return BadRequest(new { error = "Invalid data", message = "Meeting data required." });
            }

            string email = JWTGenerator.ParseGoogleJwtToken(token);
            string uloga = Backend.Models.User.getRole(email, meetingRequest.ZgradaId);

            //Console.WriteLine(meetingRequest.Naslov);

            if(uloga != "Predstavnik")                      //dobra rola
            {
                return Unauthorized(new { error = "Invalid role", message = "The user role is not high enough." });
            }
            int creatorId = Backend.Models.Racun.getID(email);
            //int creatorId = 1;

            if (meetingRequest.Status != "Planiran")  { return BadRequest(new { error = "Invalid data", message = "Meeting has to be Planiran." }); }

            try
            {
                MeetingRequest.AddMeeting(meetingRequest, creatorId);
                return Ok(new { message = "Meeting has been added." });
            }
            catch (Exception ex) { 
                return BadRequest(new { error = "Invalid data"});
            }
            
        }


        [HttpPost("objavljen/{meetingId}")]
        public IActionResult ObavljenMeeting(int meetingId)
        {
            string token = Request.Headers["token"].ToString() ?? "";

            if (token == "undefined" || token == "")        
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }
            Backend.Models.Meeting meeting = Backend.Models.Meeting.getMeeting(meetingId);
            if (meeting == null)
            {
                return NotFound(new { error = "Meeting not found", message = "Meeting with the specified ID not found." });
            }
            string email = JWTGenerator.ParseGoogleJwtToken(token);
            string uloga = Backend.Models.User.getRole(email, meeting.zgradaId);

            if (uloga != "Predstavnik")                      
            {
                return Unauthorized(new { error = "Invalid role", message = "The user role is not high enough." });
            }
            if (meeting.status != "Planiran") { return BadRequest(new { error = "Invalid change", message = "Meeting has to be Objavljen." }); }


            if (meeting.vrijeme > DateTime.Now) { return BadRequest(new { error = "Invalid change", message = "Meeting cannot be done before its planned date." }); }

            if(Backend.Models.Meeting.changeMeetingState("Objavljen",meetingId) != true) { return StatusCode(500, new { error = "Changing failed", message = "Failed to change the meeting state." }); }

            return Ok(new {message = "Meeting has been changed to Objavljen."});
        }



        [HttpPost("obavljen/{meetingId}")]
        public IActionResult ObjavljenMeeting(int meetingId)
        {
            string token = Request.Headers["token"].ToString() ?? "";

            if (token == "undefined" || token == "")        
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }
            Backend.Models.Meeting meeting = Backend.Models.Meeting.getMeeting(meetingId);
            if (meeting == null)
            {
                return NotFound(new { error = "Meeting not found", message = "Meeting with the specified ID not found." });
            }
            string email = JWTGenerator.ParseGoogleJwtToken(token);
            string uloga = Backend.Models.User.getRole(email, meeting.zgradaId);

            if (uloga != "Predstavnik")                      
            {
                return Unauthorized(new { error = "Invalid role", message = "The user role is not high enough." });
            }
            if (meeting.status != "Objavljen") { return BadRequest(new { error = "Invalid change", message = "Meeting has to be Objavljen." }); }


            if (meeting.vrijeme > DateTime.Now) { return BadRequest(new { error = "Invalid change", message = "Meeting cannot be done before its planned date." }); }

            if(Backend.Models.Meeting.changeMeetingState("Obavljen",meetingId) != true) { return StatusCode(500, new { error = "Changing failed", message = "Failed to change the meeting state." }); }

            return Ok(new {message = "Meeting has been changed to Obaljven."});
        }
        [HttpPost("obavljen")]
        public IActionResult ObavljenMeetingTockeDnevnogReda([FromBody] Meeting meeting)
        {
            string token = Request.Headers["token"].ToString() ?? "";

            if (token == "undefined" || token == "")
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }
            if (meeting == null)
            {
                return NotFound(new { error = "Meeting not found", message = "Meeting with the specified ID not found." });
            }
            string email = JWTGenerator.ParseGoogleJwtToken(token);
            string uloga = Backend.Models.User.getRole(email, meeting.zgradaId);

            if (uloga != "Predstavnik")
            {
                return Unauthorized(new { error = "Invalid role", message = "The user role is not high enough." });
            }

            if (meeting.status != "Obavljen") { return BadRequest(new { error = "Invalid change", message = "Meeting has to be Obavljen." }); }

            if (!TockaDnevnogReda.changeZakljucak(meeting)) { return StatusCode(500, new { error = "Update failed", message = "Failed to update the meeting." }); }

            return Ok(new { message = "Meetings tocke dnevnog reda have been updated." });
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

            Meeting meeting = Backend.Models.Meeting.getMeeting(meetingId);

            if(meeting == null) return BadRequest(new {error = "Deletion failed", message = "Meeting doesnt exist." });

            string uloga = Backend.Models.User.getRole(email, meeting.zgradaId);
            

            if (uloga == "Predstavnik")
            {
                bool isDeleted = Backend.Models.Meeting.deleteMeeting(meetingId);

                if (!isDeleted)
                {
                    return StatusCode(500, new { error = "Deletion failed", message = "Failed to delete the meeting." });
                }
                return Ok(new { message = "Meeting with the specified ID was deleted." });
            }
            return Unauthorized(new { error = "Invalid role", message = "The user role is not high enough." });
        }
        [HttpPost("join/{meetingId}")]
        public IActionResult JoinMeeting(int meetingId)
        {
            string token = Request.Headers["token"].ToString() ?? "";
            if (token == "undefined" || token == "")
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }

            string email = JWTGenerator.ParseGoogleJwtToken(token); //problematicno jer ce raditi i za istekle tokene

            Meeting meeting = Backend.Models.Meeting.getMeeting(meetingId);

            if (meeting == null) return BadRequest(new { error = "Joining failed", message = "Meeting doesnt exist." });

            string uloga = Backend.Models.User.getRole(email, meeting.zgradaId);
            
            if (uloga != "")
            {
                bool isJoined = Backend.Models.Meeting.joinMeeting(meeting.zgradaId,Racun.getID(email),meeting.meetingId);
                if (!isJoined)
                {
                    return StatusCode(500, new { error = "Joining failed.", message = "Failed to add user to meeting." });
                }
                return Ok(new { message = "Added to the meeting." });
            }
            return Unauthorized(new { error = "Invalid role", message = "The user role does not exist for the building." });
        }
        [HttpPost("leave/{meetingId}")]
        public IActionResult LeaveMeeting(int meetingId)
        {
            string token = Request.Headers["token"].ToString() ?? "";
            if (token == "undefined" || token == "")
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }

            string email = JWTGenerator.ParseGoogleJwtToken(token); //problematicno jer ce raditi i za istekle tokene

            Meeting meeting = Backend.Models.Meeting.getMeeting(meetingId);

            if (meeting == null) return BadRequest(new { error = "Leaving failed", message = "Meeting doesnt exist." });

            string uloga = Backend.Models.User.getRole(email, meeting.zgradaId);

            if (uloga != "")
            {
                bool isJoined = Backend.Models.Meeting.leaveMeeting(meeting.zgradaId, Racun.getID(email), meeting.meetingId);
                if (!isJoined)
                {
                    return StatusCode(500, new { error = "Leaving failed.", message = "Failed to remove user from the meeting." });
                }
                return Ok(new { message = "User left the meeting." });
            }
            return Unauthorized(new { error = "Invalid role", message = "The user role does not exist for the building." });
        }

        [HttpPost("addTocka/{meetingId}")]
        public IActionResult CreateMeeting([FromBody] TockaDnevnogRedaRequest tocka, int meetingId)
        {
            
            string token = Request.Headers["token"].ToString() ?? "";
       
            if (token == "undefined" || token == "")        //postoji token
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }

            if (tocka == null)                     //postoji tocka
            {
                return BadRequest(new { error = "Invalid data", message = "Tocka dnevnog reda je prazna." });
            }

            string email = JWTGenerator.ParseGoogleJwtToken(token);
            Meeting meeting = Backend.Models.Meeting.getMeeting(meetingId);
            string uloga = Backend.Models.User.getRole(email, meeting.zgradaId);

            //Console.WriteLine(meetingRequest.Naslov);

            if(uloga != "Predstavnik")                      //dobra rola
            {
                return Unauthorized(new { error = "Invalid role", message = "The user role is not high enough." });
            }
            int creatorId = Backend.Models.Racun.getID(email);

            if (meeting.status != "Objavljen" && meeting.status != "Planiran")  { return BadRequest(new { error = "Invalid data", message = "Meeting has to be Planiran." }); }

            try
            {
                if(Meeting.addTockaDnevnogReda(meetingId, tocka)) return Ok(new { message = "Tocka has been added." });
                else return BadRequest(new { error = "Invalid data"});
            }
            catch (Exception ex) { 
                return BadRequest(new { error = "Invalid data"});
            }
            
        }
    }
}