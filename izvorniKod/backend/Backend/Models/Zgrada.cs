namespace Backend.Models
{
    public class Zgrada
    {
<<<<<<< HEAD
        private string address { get; set; }
        public Zgrada(string address)
        {
            this.address = address;
        }

=======
        public string address { get; set; }
        public int zgradaId { get; set; }
        public Zgrada(string address, int zgradaId)
        {
            this.address = address;
            this.zgradaId = zgradaId;
        }
        public override string ToString()
        {
            return $"Zgrada ID: {zgradaId}, Address: {address}";
        }
>>>>>>> origin/backend
    }

    
}
