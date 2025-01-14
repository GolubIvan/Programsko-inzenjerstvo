using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Xml;
using Newtonsoft.Json;

namespace Backend.Controllers
{
    [Route("api")]

    public class APIController : Controller
    {
        private readonly ILogger<APIController> _logger;

        public APIController(ILogger<APIController> logger)
        {
            _logger = logger;
        }
        [HttpPost("")]
        public IActionResult Test([FromBody] MeetingRequestAPI meetingRequest)
        {
            string apiKeyGet = Request.Headers["apiKey"].ToString() ?? "";
            string apiKey = "nas_api_key";
            if(apiKeyGet == null || apiKeyGet != apiKey)
                return Unauthorized(new { error = "Invalid API key", message = "The API key is invalid or has expired." });

            if (meetingRequest == null)                     
            {
                return BadRequest(new { error = "Invalid data", message = "Meeting data required." });
            }
            Backend.Models.MeetingRequest meetingRequestDobar = new Backend.Models.MeetingRequest();
            meetingRequestDobar.Naslov = meetingRequest.Naslov;
            meetingRequestDobar.Mjesto = meetingRequest.Mjesto;
            meetingRequestDobar.Opis = meetingRequest.Opis;
            meetingRequestDobar.Vrijeme = meetingRequest.Vrijeme;
            meetingRequestDobar.Status = meetingRequest.Status;
            meetingRequestDobar.ZgradaId = meetingRequest.getZgradaId();
            meetingRequestDobar.Sazetak = meetingRequest.Sazetak;
            meetingRequestDobar.TockeDnevnogReda = new List<TockaDnevnogRedaRequest>();
            foreach (var tocka in meetingRequest.TockeDnevnogReda)
            {
                TockaDnevnogRedaRequest tockaDobar = new TockaDnevnogRedaRequest();
                tockaDobar.imeTocke = tocka.imeTocke;
                tockaDobar.imaPravniUcinak = tocka.imaPravniUcinak;
                tockaDobar.sazetak = tocka.sazetak;
                tockaDobar.stanjeZakljucka = tocka.stanjeZakljucka;
                tockaDobar.url = tocka.url;
                meetingRequestDobar.TockeDnevnogReda.Add(tockaDobar);
            }

            try
            {
                MeetingRequest.AddMeeting(meetingRequestDobar, 0);
                return Created();
            }
            catch (Exception ex) {
                Console.WriteLine(ex);
                return BadRequest(new { error = "Invalid data", message = "Failed to add the meeting." });
            }
        }
    }
}