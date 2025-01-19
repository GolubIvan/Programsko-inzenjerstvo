namespace Backend.Models
{
    public class Diskusija
    {
        public string Naslov { get; set; }
        public string Link { get; set; }
        public override string ToString()
        {
            return $"Naslov: {Naslov}, Link: {Link}";
        }
    }
}
