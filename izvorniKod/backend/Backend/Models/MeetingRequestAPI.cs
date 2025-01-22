using Npgsql;

namespace Backend.Models
{
    public class MeetingRequestAPI
    {
        public string Naslov { get; set; }
        public string Mjesto { get; set; }
        public string Opis { get; set; }
        public DateTime? Vrijeme { get; set; }
        public string Status { get; set; }
        public string Adresa { get; set; }
        public string Sazetak { get; set; }
        public List<TockaDnevnogRedaRequest> TockeDnevnogReda { get; set; } = new List<TockaDnevnogRedaRequest>();

        public override string ToString()
        {
            return $"Naslov: {Naslov}, Opis: {Opis}, Mjesto: {Mjesto}, Vrijeme: {Vrijeme}, Status: {Status}, Sazetak: {Sazetak}, TockeDnevnogReda: {string.Join(", ", TockeDnevnogReda)}";
        }
        public int getZgradaId()
        {
            int zgradaId = -1;
            using (var conn = Database.GetConnection())
            {
                var cmd = new NpgsqlCommand("SELECT zgrada_id FROM zgrada WHERE adresa = @adresa", conn);
                cmd.Parameters.AddWithValue("adresa", Adresa);
                var reader = cmd.ExecuteReader();
                if (reader.Read() == false)
                {
                    reader.Close();
                    return -1;
                }
                zgradaId = reader.GetInt32(0);
                reader.Close();
            }
            return zgradaId;
        }
    }
}
