using Npgsql;
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
            var cmd = new NpgsqlCommand("SELECT lozinka FROM korisnik WHERE email = @email", conn);
            cmd.Parameters.AddWithValue("email", email);
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

        public static List<pair<int, string>> getUserData(string email){
            List<pair<int, string>> zgrade_uloge = new List<pair<int, string>>(); 
            if(email is null || email == "") {
                Console.WriteLine("User not found.");
                return zgrade_uloge;
            }
            var conn = Database.GetConnection();
            
            using (var cmd = new NpgsqlCommand("SELECT zgradaID FROM korisnik JOIN account USING (userId) WHERE email = @email", conn))
            {
                cmd.Parameters.AddWithValue("email", email);
                var reader = cmd.ExecuteReader();
                while (reader.Read()){
                    int read = reader.GetInt32(0);
                    int role = Backend.Models.User.getRole(email, read);
                    zgrade_uloge.Add(make_pair(read, role)); 
                }
                    
                reader.Close();
            }
            return zgrade_uloge;
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
