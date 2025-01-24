using Backend.Models;
using Npgsql;

public class DatabaseTestStoring
{
    [Fact]
    public void GetMeetingsForBuilding_ShouldReturnMeetings()
    {
        int buildingId = 5; 
        var expectedMeetingCount = 1;
        using (var conn = Database.GetConnection())
        {for (int i = 0; i < expectedMeetingCount; i++)
            {using (var cmd = new NpgsqlCommand("INSERT INTO sastanak (sazetakNamjereSastanka, vrijemeSastanka, mjestoSastanka, statusSastanka, " +
                "naslovSastanaka, zgradaID, kreatorID) VALUES (@sazetak, @vrijeme, @mjesto, @status, @naslov, @zgradaId, @kreatorId)", conn))
                {cmd.Parameters.AddWithValue("sazetak", "Sample summary " + (i + 1));
                    cmd.Parameters.AddWithValue("vrijeme", DateTime.Now.AddMinutes(i * 10));
                    cmd.Parameters.AddWithValue("mjesto", "Room " + (i + 1));
                    cmd.Parameters.AddWithValue("status", "Scheduled");
                    cmd.Parameters.AddWithValue("naslov", "Meeting " + (i + 1));
                    cmd.Parameters.AddWithValue("zgradaId", buildingId);
                    cmd.Parameters.AddWithValue("kreatorId", 9); 
                    cmd.ExecuteNonQuery();
                }
            }
        }
        List<Meeting> meetings = Meeting.getMeetingsForBuilding(buildingId);
        Assert.NotNull(meetings);
        Assert.True(meetings.Count > 0, "No meetings were retrieved.");
        Assert.Equal(expectedMeetingCount, meetings.Count);
        var firstMeeting = meetings[0];
        Assert.NotEmpty(firstMeeting.naslov);
        Assert.NotEmpty(firstMeeting.mjesto);
        using (var conn = Database.GetConnection())
        {using (var cmd = new NpgsqlCommand("DELETE FROM sastanak WHERE zgradaID = @buildingId", conn))
            {cmd.Parameters.AddWithValue("buildingId", buildingId);cmd.ExecuteNonQuery(); }}}
}
