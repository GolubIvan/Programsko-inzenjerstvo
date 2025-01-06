namespace Backend.Models
{
    public class UpdateTockeDnevnogRedaRequest
    {
        public List<TockaDnevnogRedaRequest> TockeDnevnogReda { get; set; } = new List<TockaDnevnogRedaRequest>();
        public override string ToString()
        {
            string tocke = "";

            foreach (var tocka in TockeDnevnogReda)
            {
                tocke += tocka.ToString() + "\n";
            }
            return tocke;
        }
    }


}