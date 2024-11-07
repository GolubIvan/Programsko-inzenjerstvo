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
    }
}
