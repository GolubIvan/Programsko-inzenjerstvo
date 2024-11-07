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
    }
}
