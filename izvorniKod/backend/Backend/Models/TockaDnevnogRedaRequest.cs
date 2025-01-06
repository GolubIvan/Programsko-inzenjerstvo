namespace Backend.Models
{
    public class TockaDnevnogRedaRequest
    {
        public string imeTocke { get; set; }
        public bool imaPravniUcinak { get; set; }
        public string sazetak { get; set; }
        public string stanjeZakljucka { get; set; }
        public string url { get; set; }

        public override string ToString()
        {
            return $"Ime tocke: {imeTocke}, Ima pravni ucinak: {imaPravniUcinak}, Sazetak: {sazetak}, Stanje zakljucka: {stanjeZakljucka}, Url: {url}";
        }

    }


}
