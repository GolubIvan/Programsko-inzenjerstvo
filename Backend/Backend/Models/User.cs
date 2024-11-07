using Npgsql;
using BCrypt.Net;

namespace Backend.Models
{
    public class User
    {
        protected Zgrada zgrada { get; set; }

        public User(Zgrada zgrada)
        {
            this.zgrada = zgrada;
        }

        public Boolean checkPassword(int userId, string inputPassword)
        {
            //inputPassword = "lozinka123";
            //userId = 1; // Example user ID

            var conn = Database.GetConnection();
            string storedHash = "";
            using (var cmd = new NpgsqlCommand("SELECT lozinka FROM korisnik WHERE userid = @id", conn))
            {
                cmd.Parameters.AddWithValue("id", userId);
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                    storedHash = reader.GetString(0);
                else
                    Console.WriteLine("User not found.");
            }

            if (BCrypt.Net.BCrypt.Verify(inputPassword, storedHash))
                return true;
            else
                return false;
        }
    }
}
