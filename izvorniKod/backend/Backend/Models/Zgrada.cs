using Npgsql;

namespace Backend.Models
{
    public class Zgrada
    {
        public string address { get; set; }
        public int zgradaId { get; set; }
        public Zgrada(string address, int zgradaId)
        {
            this.address = address;
            this.zgradaId = zgradaId;
        }
        public override string ToString()
        {
            return $"Zgrada ID: {zgradaId}, Address: {address}";
        }

        public static List<Zgrada> getAllBuildings()
        {
            List<Zgrada> zgrade = new List<Zgrada>();
            var conn = Database.GetConnection();
            using (var cmd = new NpgsqlCommand("SELECT * FROM zgrada", conn))
            {
            var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                zgrade.Add(new Zgrada(reader.GetString(1), reader.GetInt32(0)));
            }
            reader.Close();
            }
            return zgrade;
        }
    }

    
}
