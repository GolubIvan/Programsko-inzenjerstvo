namespace Backend.Models
{
    public class Zgrada
    {
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
    }

    
}
