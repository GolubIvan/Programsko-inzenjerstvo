using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Xml;
using Newtonsoft.Json;

namespace Backend.Controllers
{
    [Route("api")]
    public static class APIController : Controller
    {
        [HttpPost("")]
        public IActionResult Test([FromBody] MeetingRequestAPI meetingRequest)
        {
            string apiKeyGet = Request.Headers["apiKey"].ToString() ?? "";
            string apiKey = "nas_api_key";
            if(apiKeyGet == null || apiKeyGet != apiKey)
                return Unauthorized(new { error = "Invalid API key", message = "The API key is invalid or has expired." });

            if (meetingRequest == null)                     //postoji meeting
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
                tockaDobar.ImeTocke = tocka.ImeTocke;
                tockaDobar.ImaPravniUcinak = tocka.ImaPravniUcinak;
                tockaDobar.SazetakRasprave = tocka.SazetakRasprave;
                tockaDobar.StanjeZakljucka = tocka.StanjeZakljucka;
                tockaDobar.LinkNaDiskusiju = tocka.LinkNaDiskusiju;
                meetingRequestDobar.TockeDnevnogReda.Add(tockaDobar);
            }

            try
            {
                MeetingRequest.AddMeeting(meetingRequestDobar, 0);
                return Created(new { message = "Meeting has been added." });
            }
            catch (Exception ex) {
                Console.WriteLine(ex);
                return BadRequest(new { error = "Invalid data", message = "Failed to add the meeting." });
            }
        }
    }
}