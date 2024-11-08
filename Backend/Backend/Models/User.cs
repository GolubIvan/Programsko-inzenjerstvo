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
            var cmd = new NpgsqlCommand("SELECT lozinka FROM korisnik WHERE userid = @id", conn);
            cmd.Parameters.AddWithValue("id", userId);
            var reader = cmd.ExecuteReader();
            if (reader.Read())
                storedHash = reader.GetString(0);
            else
                Console.WriteLine("User not found.");
            reader.Close();
            if (BCrypt.Net.BCrypt.Verify(inputPassword, storedHash))
                return true;
            else
                return false;
        }

        public static int getUserData(string email){
            if(email is null) {
                Console.WriteLine("User not found.");
                return -1;
            }
            var conn = Database.GetConnection();
            int userId = -1;
            using (var cmd = new NpgsqlCommand("SELECT userId FROM korisnik WHERE email = @email", conn))
            {
                cmd.Parameters.AddWithValue("email", email);
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                    userId = reader.GetInt32(0); 
                else
                    Console.WriteLine("User not found.");
                reader.Close();
            }
            return userId;
        }

        public Boolean changePassword(int userId, string oldPassword, string newPassword)
        {
            if (checkPassword(userId, oldPassword))
            {
                var conn = Database.GetConnection();
                var cmd = new NpgsqlCommand("UPDATE korisnik SET lozinka = @newPassword WHERE userId = @id", conn);
                cmd.Parameters.AddWithValue("newPassword", BCrypt.Net.BCrypt.HashPassword(newPassword));
                cmd.Parameters.AddWithValue("id", userId);
                cmd.ExecuteNonQuery();
                return true;
            }
            else
                return false;
          
        }

        public List<Meeting> dohvatiMeetinge(int zgradaId)
        {
            var conn = Database.GetConnection();
            List<Meeting> meetings = new List<Meeting>();
            var cmd = new NpgsqlCommand("SELECT * FROM meeting WHERE zgradaId = @id", conn);
            cmd.Parameters.AddWithValue("id", zgradaId);
            var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                meetings.Add(new Meeting(reader.GetInt32(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetDateTime(2)));
            }
            return meetings;
        }
    }
}
