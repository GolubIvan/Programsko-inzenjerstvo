using Npgsql;

namespace Backend.Models
{
    public class MeetingRequest
    {
        public string Naslov { get; set; }
        public string Opis { get; set; }
        public string Mjesto { get; set; }
        public DateTime? Vrijeme { get; set; }
        public string Status { get; set; }
        public int ZgradaId { get; set; }
        public string Sazetak { get; set; }
        public List<TockaDnevnogRedaRequest> TockeDnevnogReda { get; set; }

        public static void AddMeeting(MeetingRequest meetingRequest,int creatorId)
        {
            var conn = Database.GetConnection();


            string insertMeetingQuery = "INSERT INTO sastanak (sazetaknamjeresastanka, vrijemesastanka, mjestosastanka, naslovsastanaka, statussastanka, zgradaID, kreatorID) VALUES(@SazetakNamjereSastanka, @VrijemeSastanka, @MjestoSastanka,@NaslovSastanaka, @StatusSastanka, @ZgradaID, @KreatorID)";
            int sastanakId;
            using (var cmd = new NpgsqlCommand(insertMeetingQuery, conn))
            {
                cmd.Parameters.AddWithValue("@SazetakNamjereSastanka", meetingRequest.Sazetak ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@VrijemeSastanka", meetingRequest.Vrijeme);
                cmd.Parameters.AddWithValue("@StatusSastanka", meetingRequest.Status);
                cmd.Parameters.AddWithValue("@MjestoSastanka", meetingRequest.Mjesto);
                cmd.Parameters.AddWithValue("@NaslovSastanaka", meetingRequest.Naslov);
                cmd.Parameters.AddWithValue("@ZgradaID", meetingRequest.ZgradaId);
                cmd.Parameters.AddWithValue("@KreatorID", creatorId);

                sastanakId = (int)cmd.ExecuteNonQuery();
            }


            string insertAgendaItemQuery = "INSERT INTO tocka_dnevnog_reda (imetocke, imapravniucinak, sazetakrasprave, stanjezakljucka, linknadiskusiju, sastanakid) VALUES(@ImeTocke, @ImaPravniUcinak, @SazetakRasprave, @StanjeZakljucka, @LinkNaDiskusiju, @SastanakID)";

            foreach (var tocka in meetingRequest.TockeDnevnogReda)
            {
                using (var cmd = new NpgsqlCommand(insertAgendaItemQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@ImeTocke", tocka.ImeTocke);
                    cmd.Parameters.AddWithValue("@ImaPravniUcinak", tocka.ImaPravniUcinak);
                    cmd.Parameters.AddWithValue("@SazetakRasprave", tocka.Sazetak ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@StanjeZakljucka", tocka.StanjeZakljucka ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@LinkNaDiskusiju", tocka.Url ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@SastanakID", sastanakId);

                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
