using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Net;

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
            string uloga = "",address = "";
            foreach (var zgrada in zgrade)
            {
                if (zgrada.Key.zgradaId == buildingId)
                {
                    uloga = zgrada.Value;
                    address = zgrada.Key.address;
                    break;
                }
            }
            if (uloga == "") { return Unauthorized(new { error = "Invalid role", message = "The user role is not high enough." }); }

            List<Backend.Models.Meeting> meetings = Backend.Models.Meeting.getMeetingsForBuilding(buildingId);

            if (meetings == null)
            {
                return NotFound(new { error = "No meetings found", message = "No meetings found for the specified building." });
            }
            int userId = Racun.getID(email);
            var modifiedMeetings = meetings.Select(meeting => new
            {
                meetingId = meeting.meetingId,
                naslov = meeting.naslov,
                mjesto = meeting.mjesto,
                vrijeme = meeting.vrijeme,
                status = meeting.status,
                zgradaId = meeting.zgradaId,
                kreatorId = meeting.kreatorId,
                sazetak = meeting.sazetak,
                sudjelovanje = Meeting.checkSudjelovanje(buildingId,userId, meeting.meetingId), 
                brojSudionika = Meeting.checkSudioniciCount(buildingId,meeting.meetingId),
                tockeDnevnogReda = meeting.tockeDnevnogReda,
                isCreator = meeting.kreatorId
            }).ToList();


            return Ok(new { buildingId = buildingId, address = address, role = uloga, meetings = modifiedMeetings });
        }

        [HttpGet]
        public IActionResult GetAllBuildings()
        {
            var token = Request.Headers["token"];
            if (token == "undefined")
            {
            return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }
            _logger.LogInformation("Checking user with token: {Token}", token);

            string email = JWTGenerator.ParseGoogleJwtToken(token);

            if (email == null)
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }

            List<Backend.Models.Zgrada> zgrade = Backend.Models.Zgrada.getAllBuildings();

            return Ok(new { zgrade = zgrade });
        }
    }
}