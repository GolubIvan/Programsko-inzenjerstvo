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
            using (var conn = Database.GetConnection())
            {
                // Provjera postoji li korisnik
                using (var cmd = new NpgsqlCommand("SELECT userid FROM korisnik WHERE email = @email FOR UPDATE", conn))
                {
                    cmd.Parameters.AddWithValue("email", email);
                    Console.WriteLine("tu je: |" + email + "|");

                    using (var reader = cmd.ExecuteReader())
                    {
                        password = BCrypt.Net.BCrypt.HashPassword(password);

                        if (reader.Read())
                        {
                            Console.WriteLine("User already exists.");
                            return false;
                        }
                    }
                }

                // Provjera postoji li zgrada. Ako ne, dodajemo ju
                using (var cmd = new NpgsqlCommand("SELECT zgradaId FROM zgrada WHERE adresaZgrade = @address FOR UPDATE", conn))
                {
                    cmd.Parameters.AddWithValue("address", address);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (!reader.Read())
                        {
                            reader.Close();
                            using (var insertCmd = new NpgsqlCommand("INSERT INTO zgrada (adresaZgrade) VALUES (@address)", conn))
                            {
                                insertCmd.Parameters.AddWithValue("address", address);
                                insertCmd.ExecuteNonQuery();
                            }
                        }
                    }
                }

                // Dodavanje korisnika
                using (var cmd = new NpgsqlCommand("" +
                    "INSERT INTO korisnik (email, lozinka, imeKorisnika) VALUES (@email, @password, @name);" +
                    "INSERT INTO account (role, zgradaId, userId) VALUES (@role, COALESCE((SELECT zgradaId FROM zgrada WHERE adresaZgrade = @address), 0), (SELECT userId FROM korisnik where email = @email));", conn))
                {
                    cmd.Parameters.AddWithValue("email", email);
                    cmd.Parameters.AddWithValue("password", password);
                    cmd.Parameters.AddWithValue("name", name);
                    cmd.Parameters.AddWithValue("role", role);
                    cmd.Parameters.AddWithValue("address", address);
                    cmd.ExecuteNonQuery();
                }

                return true;
            }
        }
    }
}