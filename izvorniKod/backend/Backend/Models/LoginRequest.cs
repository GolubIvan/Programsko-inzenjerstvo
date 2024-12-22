namespace Backend.Models
{
    public class LoginRequest
    {
        public string Password { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public string Zgrada { get; set; }
        public string Token {get; set;}
    }
}
