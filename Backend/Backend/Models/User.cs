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

            var conn = Database.GetConnection();
            

        using (var cmd = new NpgsqlCommand("SELECT role FROM account JOIN korisnik USING(userID) WHERE zgradaId = @zgradaId AND email = @email", conn))
            { 
            cmd.Parameters.AddWithValue("zgradaId", zgradaId);
            cmd.Parameters.AddWithValue("email", email);          

            using (var reader = cmd.ExecuteReader())
                {
                 if (reader.Read())role = reader.GetString(0);
                }
            }        

            return role;
        }
    }
}
