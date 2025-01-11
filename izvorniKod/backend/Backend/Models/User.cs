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

        //ana token:
        //eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmFAZ21haWwuY29tIiwiZXhwIjoxNzM1NTc0MDg3LCJpc3MiOiJ5b3VyLWFwcCIsImF1ZCI6WyJ5b3VyLWFwcC11c2VycyIsInlvdXItYXBwLXVzZXJzIl0sImVtYWlsIjoiYW5hQGdtYWlsLmNvbSJ9.vcED2tUJxazoPd_VCxR3rRN6anT_2eEr83tIQYc1t9w

        // public List<Meeting> dohvatiMeetinge(int zgradaId)
        // {
        //     var conn = Database.GetConnection();
        //     List<Meeting> meetings = new List<Meeting>();
        //     var cmd = new NpgsqlCommand("SELECT * FROM meeting WHERE zgradaId = @id", conn);
        //     cmd.Parameters.AddWithValue("id", zgradaId);
        //     var reader = cmd.ExecuteReader();
        //     while (reader.Read())
        //     {
        //         meetings.Add(new Meeting(reader.GetInt32(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetDateTime(2)));
        //     }
        //     return meetings;
        // }

        public static string getRole(string email, int zgradaId)
        {
            string role = "";

            using (var conn = Database.GetConnection())
            using (var cmd = new NpgsqlCommand("SELECT role FROM account JOIN korisnik ON account.userid = korisnik.userid WHERE zgradaid = @zgradaId AND email = @email FOR UPDATE", conn))
            { 
                cmd.Parameters.AddWithValue("zgradaId", zgradaId);
                cmd.Parameters.AddWithValue("email", email);          

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read()) role = reader.GetString(0);
                }
            }        

            return role;
        }

        public static List<string> getKorisniciForZgrada(int zgradaId)
        {
            List<string> emails = new List<string>();
            using (var conn = Database.GetConnection())
            using (var cmd = new NpgsqlCommand("SELECT email FROM account NATURAL JOIN korisnik WHERE zgradaid = @zgradaId FOR UPDATE", conn))
            {
                cmd.Parameters.AddWithValue("zgradaId", zgradaId);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    string email = reader.GetString(0);
                    emails.Add(email);
                }
                reader.Close();
            }
            
            return emails;
        }

        public static bool changePassword(string email, string newPassword)
        {
            using (var conn = Database.GetConnection())
            using (var cmd = new NpgsqlCommand("UPDATE korisnik SET lozinka = @newPassword WHERE email = @email", conn))
            {
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);
                cmd.Parameters.AddWithValue("newPassword", hashedPassword);
                cmd.Parameters.AddWithValue("email", email);

                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
    }
}
