namespace Backend.Models
{
    public class Meeting
    {
        private int meetingId { get; set; }
        private string title { get; set; }
        private string opis { get; set; }
        private string mjesto { get; set; }
        private DateTime? vrijeme { get; set; }

        private Status StanjeSastanka { get; set; }

        private List<TockaDnevnogReda> tockeDnevnogReda { get; set; }

        public Meeting(int meetingId, string title, string opis, string mjesto, DateTime? vrijeme)
        {
            this.meetingId = meetingId;
            this.title = title;
            this.opis = opis;  
            this.mjesto = mjesto;
            this.vrijeme = vrijeme;
            this.StanjeSastanka = Status.Planiran;
            this.tockeDnevnogReda = new List<TockaDnevnogReda>();
        }
    }
}
