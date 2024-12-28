namespace Backend.Models
{
    public class TockaDnevnogReda
    {
        public int id { get; set; }
        public string imeTocke { get; set; }
        public bool imaPravniUcinak { get; set; }
        public string? sazetak { get; set; }
        public string stanjeZakljucka { get; set; }
        public string? url { get; set; }
        public int sastanakId { get; set; }

        public TockaDnevnogReda(int id, string imeTocke, bool imaPravniUcinak, string? sazetak, string stanjeZakljucka, string? url, int sastanakId)
        {
            this.id = id;
            this.imeTocke = imeTocke;
            this.imaPravniUcinak = imaPravniUcinak;
            this.sazetak = sazetak;
            this.stanjeZakljucka = stanjeZakljucka;
            this.url = url;
            this.sastanakId = sastanakId;
        }
    }
}
