namespace Backend.Models
{
    public class ChangePasswordRequest
    {
        public string newPassword { get; set; }
        public string oldPassword { get; set; }
    }
}