namespace Backend.Models
{
    public class TockaDnevnogRedaRequest
    {
        public string ImeTocke { get; set; }
        public bool ImaPravniUcinak { get; set; }
        public string Sazetak { get; set; }
        public string StanjeZakljucka { get; set; }
        public string Url { get; set; }

        public override string ToString()
        {
            return $"Ime tocke: {ImeTocke}, Ima pravni ucinak: {ImaPravniUcinak}, Sazetak: {Sazetak}, Stanje zakljucka: {StanjeZakljucka}, Url: {Url}";
        }

    }


}
