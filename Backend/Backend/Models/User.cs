namespace Backend.Models
{
    public class User
    {
        protected Zgrada zgrada {  get; set; }

        public User(Zgrada zgrada)
        {
            this.zgrada = zgrada;
        }
    }
}
