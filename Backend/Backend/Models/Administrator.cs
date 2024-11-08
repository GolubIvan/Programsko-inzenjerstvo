using Npgsql;

namespace Backend.Models
{
    public class Administrator
    {
        private string email { get; set; }
        private string password { get; set; }
        private string username { get; set; }

        public Administrator(string email, string password, string username)
        {
            this.username = username;
            this.email = email;
            this.password = password;
        }

        public static Boolean addUser(string email, string name, string password, string role, string address)
        {
            var conn = Database.GetConnection();

            var cmd = new NpgsqlCommand("SELECT userid FROM korisnik WHERE email = @email", conn);
            cmd.Parameters.AddWithValue("email", email);
            var reader = cmd.ExecuteReader();
            password = BCrypt.Net.BCrypt.HashPassword(password);

            if (reader.Read())
            {
                Console.WriteLine("User already exists.");
                return false;
            }

            cmd = new NpgsqlCommand("" +
                "INSERT INTO korisnik (email, lozinka, imeKorisnika) VALUES (@email, @password, @name);" +
                "INSERT INTO account (role, zgradaId, userId) VALUES (@role, (SELECT zgradaId where address = @address), (SELECT userId where email = @email));", conn);
            cmd.Parameters.AddWithValue("email", email);
            cmd.Parameters.AddWithValue("password", password);
            cmd.Parameters.AddWithValue("name", name);
            cmd.Parameters.AddWithValue("role", role);
            cmd.Parameters.AddWithValue("address", address);
            cmd.ExecuteNonQuery();

            return true;
        }
    
        
    }
}
