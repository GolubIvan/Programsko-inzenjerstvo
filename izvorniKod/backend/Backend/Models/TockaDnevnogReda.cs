namespace Backend.Models
{
    public class TockaDnevnogReda
    {
        private string opis {  get; set; }
        private StanjeTocke stanje { get; set; }
        private Boolean pravniUcinak {  get; set; }

        public TockaDnevnogReda(string opis, Boolean pravniUcinak)
        {
            this.opis = opis;
            this.pravniUcinak = pravniUcinak;
            this.stanje = StanjeTocke.Nedefiniran;
            
        }
    }
}
