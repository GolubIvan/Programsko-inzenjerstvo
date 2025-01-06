<<<<<<< HEAD
﻿namespace Backend.Models
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
            
=======
﻿using Npgsql;

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


        public static bool changeZakljucak(Meeting meeting)
        {
            try
            {
                var conn = Database.GetConnection();
                string updateTocka = "UPDATE tocka_dnevnog_reda SET stanjezakljucka = @stanje WHERE tdr_id = @tdr_id";
                foreach (var tocka in meeting.tockeDnevnogReda)
                {
                    using (var cmd = new NpgsqlCommand(updateTocka, conn))
                    {
                        if(tocka.stanjeZakljucka != null)
                        {
                            cmd.Parameters.AddWithValue("stanje",tocka.stanjeZakljucka);
                            cmd.Parameters.AddWithValue("tdr_id", tocka.id);
                            cmd.ExecuteNonQuery();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error deleting meeting: " + ex.Message);
                return false;
            }
            return true;
>>>>>>> origin/backend
        }
    }
}
