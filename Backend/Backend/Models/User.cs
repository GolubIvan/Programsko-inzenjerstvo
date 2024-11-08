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

        public static Boolean checkPassword(int userId, string inputPassword)
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

        public static string getUserData(string email){
            if(email is null) {
                Console.WriteLine("User not found.");
                return "";
            }
            var conn = Database.GetConnection();
            string userId = "";
            using (var cmd = new NpgsqlCommand("SELECT userId FROM korisnik WHERE email = @email", conn))
            {
                cmd.Parameters.AddWithValue("email", email);
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                    userId = reader.GetString(0);
                else
                    Console.WriteLine("User not found.");
            }
            return userId;
        }
    }
}
