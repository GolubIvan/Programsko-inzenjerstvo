using Npgsql;
using System.Data;
namespace Backend.Models

{
    public class Racun
    {
        private string email { get; set; }
        private string password { get; set; }
        private string username { get; set; }

        private List<User> users { get; set; }

        public Racun(string email, string password, string username, User user)
        {
            this.username = username;
            this.email = email;
            this.password = password;
            this.users = new List<User>();
            this.users.Append(user);
        }

        public static Boolean checkPassword(string email, string inputPassword)
        {
            //inputPassword = "lozinka123";
            //userId = 1; // Example user ID

            var conn = Database.GetConnection();
            string storedHash = "";
            var cmd = new NpgsqlCommand("SELECT lozinka FROM korisnik WHERE email = @email FOR UPDATE", conn);
            cmd.Parameters.AddWithValue("email", email);
            var reader = cmd.ExecuteReader();
            if (reader.Read())
                storedHash = reader.GetString(0);
            else
                {
                Console.WriteLine("User not found.");
                reader.Close();
                return false;
                }
            reader.Close();
            if (BCrypt.Net.BCrypt.Verify(inputPassword, storedHash))
                return true;
            else
                return false;
        }

        public static List<KeyValuePair<Backend.Models.Zgrada, string>> getUserData(string email){
            List<KeyValuePair<Backend.Models.Zgrada, string>> zgrade_uloge = new List<KeyValuePair<Backend.Models.Zgrada, string>>(); 
            if(email is null || email == "") {
                Console.WriteLine("User not found.");
                return zgrade_uloge;
            }
            var conn = Database.GetConnection();
            using (var cmd = new NpgsqlCommand("SELECT zgradaId, adresaZgrade, role FROM korisnik JOIN account NATURAL JOIN zgrada USING (userId) WHERE email = @email FOR UPDATE", conn))
            {
                cmd.Parameters.AddWithValue("email", email);
                var reader = cmd.ExecuteReader();
                while (reader.Read()){
                    int zgradaId = reader.GetInt32(0);
                    string adresaZgrade = reader.GetString(1);
                    string uloga = reader.GetString(2);
                    var par = new KeyValuePair<Backend.Models.Zgrada, string>(new Backend.Models.Zgrada(adresaZgrade, zgradaId), uloga);
                    zgrade_uloge.Add(par);
                    // Console.WriteLine(par);
                }
                reader.Close();
            }

            return zgrade_uloge;
        }
        public static int getID(string email)
        {
            int id = -1;
            var conn = Database.GetConnection();
            using (var cmd = new NpgsqlCommand("SELECT userID FROM korisnik WHERE email = @email FOR UPDATE", conn))
            {
                cmd.Parameters.AddWithValue("email", email);
                var reader = cmd.ExecuteReader();
                if(reader.Read())
                {
                    id = reader.GetInt16(0);
                }
                reader.Close();
            }
            return id;
        }
        public Boolean changePassword(string email, string oldPassword, string newPassword)
        {
            if (checkPassword(email, oldPassword))
            {
                var conn = Database.GetConnection();
                var cmd = new NpgsqlCommand("UPDATE korisnik SET lozinka = @newPassword WHERE email = @email", conn);
                cmd.Parameters.AddWithValue("newPassword", BCrypt.Net.BCrypt.HashPassword(newPassword));
                cmd.Parameters.AddWithValue("email", email);
                cmd.ExecuteNonQuery();
                return true;
            }
            else
                return false;
          
        }
    }
}
