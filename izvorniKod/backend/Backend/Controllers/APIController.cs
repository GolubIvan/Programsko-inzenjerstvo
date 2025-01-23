using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Xml;
using Newtonsoft.Json;
using System.Text;
using Newtonsoft.Json.Linq;

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
        [HttpPost("create")]
        public IActionResult apiCreate([FromBody] MeetingRequestAPI meetingRequest)
        {
            string apiKeyGet = Request.Headers["apiKey"].ToString() ?? "";
            string apiKey = "c92cd177-4267-4e7e-871c-3f68c7f1acfd";
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
            meetingRequestDobar.ZgradaId = 4;
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
                MeetingRequest.AddMeeting(meetingRequestDobar, 1);
                return Ok(new { message = "Meeting has been added." });
            }
            catch (Exception ex) {
                Console.WriteLine(ex);
                return BadRequest(new { error = "Invalid data", message = "Failed to add the meeting." });
            }
        }
        [HttpGet("diskusije")]
        public async Task<IActionResult> dobiDiskusijeAsync(string zgrada,string keyword)
        {
            string url = "https://be30c39fc6db.ngrok.app/slanjeRazgovoraPrekoApi";
            string ApiKey = "ApiKey key";

            string token = Request.Headers["token"].ToString() ?? "";

            if (token == "undefined" || token == "")
            {
                return Unauthorized(new { error = "Invalid token", message = "The user token is invalid or has expired." });
            }
            if (keyword == null)                         
            {
                return BadRequest(new { error = "Invalid data", message = "Keyword required." });
            }
            if (zgrada == null)
            {
                return BadRequest(new { error = "Invalid data", message = "Keyword required." });
            }
            try
            {
                using HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", ApiKey);
                client.DefaultRequestHeaders.Add("Naslov-diskusije", keyword);
                client.DefaultRequestHeaders.Add("ID-zgrade", zgrada);
                HttpResponseMessage response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, new { error = "API Error", message = "Failed to fetch data from external API." });
                }

                string responseData = await response.Content.ReadAsStringAsync();

                var jsonResponse = JsonConvert.DeserializeObject<JObject>(responseData);
                if (jsonResponse == null)
                {
                    return Ok(new { diskusije = new string[] { } });
                }
                var foundNaslovi = jsonResponse["foundNaslovi"] as JArray;
                var siteLink = jsonResponse["siteLink"]?.ToString();

                if (foundNaslovi == null || !foundNaslovi.Any())
                {
                    return Ok(new { diskusije = new string[] { } });
                }

                var diskusije = foundNaslovi
                    .Distinct()
                    .Select(naslov => new Diskusija
                    {
                        Naslov = naslov.ToString(),
                        Link = $"{siteLink}&naslov={Uri.EscapeDataString(naslov.ToString())}"
                    })
                    .ToList();

                return Ok(diskusije);
            }
            catch (HttpRequestException httpEx)
            {
                return Ok(new { diskusije = new string[] { } });
            }
            catch (Exception ex)
            {
                return Ok(new { diskusije = new string[] { } });
            }
        }
    }
}