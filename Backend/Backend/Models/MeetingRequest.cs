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
        public List<TockaDnevnogRedaRequest> TockeDnevnogReda { get; set; } = new List<TockaDnevnogRedaRequest>();

        public override string ToString()
        {
            return $"Naslov: {Naslov}, Opis: {Opis}, Mjesto: {Mjesto}, Vrijeme: {Vrijeme}, Status: {Status}, ZgradaId: {ZgradaId}, Sazetak: {Sazetak}, TockeDnevnogReda: {string.Join(", ", TockeDnevnogReda)}";
        }
        public static void AddMeeting(MeetingRequest meetingRequest,int creatorId)
        {
            var conn = Database.GetConnection();


            string insertMeetingQuery =
                "INSERT INTO sastanak (sazetaknamjeresastanka, vrijemesastanka, mjestosastanka, naslovsastanaka, statussastanka, zgradaID, kreatorID) " +
                "VALUES(@SazetakNamjereSastanka, @VrijemeSastanka, @MjestoSastanka,@NaslovSastanaka, @StatusSastanka, @ZgradaID, @KreatorID) " +
                "RETURNING sastanakid";
            
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

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        sastanakId = reader.GetInt32(0); // Retrieve the first column, which is the ID
                    }
                    else
                    {
                        throw new Exception("Failed to retrieve the ID of the newly inserted meeting.");
                    }
                }
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
        public static void UpdateMeeting(MeetingRequest meetingRequest, int meetingId)
        {
            var conn = Database.GetConnection();

            string updateMeetingQuery =
                "UPDATE sastanak SET sazetaknamjeresastanka = @SazetakNamjereSastanka, vrijemesastanka = @VrijemeSastanka, mjestosastanka = @MjestoSastanka, naslovsastanaka = @NaslovSastanaka, statussastanka = @StatusSastanka, zgradaID = @ZgradaID WHERE sastanakid = @SastanakID";

            Console.WriteLine("Evo ga: " + meetingRequest);

            using (var cmd = new NpgsqlCommand(updateMeetingQuery, conn))
            {
                cmd.Parameters.AddWithValue("@SazetakNamjereSastanka", meetingRequest.Sazetak ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@VrijemeSastanka", meetingRequest.Vrijeme ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@StatusSastanka", meetingRequest.Status);
                cmd.Parameters.AddWithValue("@MjestoSastanka", meetingRequest.Mjesto);
                cmd.Parameters.AddWithValue("@NaslovSastanaka", meetingRequest.Naslov);
                cmd.Parameters.AddWithValue("@ZgradaID", meetingRequest.ZgradaId);
                cmd.Parameters.AddWithValue("@SastanakID", meetingId);

                cmd.ExecuteNonQuery();
            }

            string deleteAgendaItemsQuery = "DELETE FROM tocka_dnevnog_reda WHERE sastanakid = @SastanakID";

            using (var cmd = new NpgsqlCommand(deleteAgendaItemsQuery, conn))
            {
                cmd.Parameters.AddWithValue("@SastanakID", meetingId);

                cmd.ExecuteNonQuery();
            }

            string insertAgendaItemQuery = "INSERT INTO tocka_dnevnog_reda (imetocke, imapravniucinak, sazetakrasprave, stanjezakljucka, linknadiskusiju, sastanakid) VALUES(@ImeTocke, @ImaPravniUcinak, @SazetakRasprave, @StanjeZakljucka, @LinkNaDiskusiju, @SastanakID)";

            foreach (var tocka in meetingRequest.TockeDnevnogReda)
            {
                using (var cmd = new NpgsqlCommand(insertAgendaItemQuery, conn)){
                    cmd.Parameters.AddWithValue("@ImeTocke", tocka.ImeTocke);
                    cmd.Parameters.AddWithValue("@ImaPravniUcinak", tocka.ImaPravniUcinak);
                    cmd.Parameters.AddWithValue("@SazetakRasprave", tocka.Sazetak ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@StanjeZakljucka", tocka.StanjeZakljucka ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@LinkNaDiskusiju", tocka.Url ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@SastanakID", meetingId);

                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
