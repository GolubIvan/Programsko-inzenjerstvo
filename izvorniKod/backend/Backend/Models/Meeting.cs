using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using Npgsql;

namespace Backend.Models
{
    public class Meeting
    {
        public int meetingId { get; set; }
        public string naslov { get; set; }
        public string mjesto { get; set; }
        public DateTime? vrijeme { get; set; }
        public string status { get; set; }
        public int zgradaId { get; set; }
        public int kreatorId { get; set; }
        public string sazetak { get; set; }
        public List<TockaDnevnogReda> tockeDnevnogReda { get; set; }

        public Meeting(int meetingId, string naslov, string mjesto, DateTime? vrijeme, string status, int zgradaId, int kreatorId, string sazetak)
        {
            this.meetingId = meetingId;
            this.naslov = naslov;
            this.mjesto = mjesto;
            this.vrijeme = vrijeme;
            this.status = status;
            this.zgradaId = zgradaId;
            this.kreatorId = kreatorId;
            this.sazetak = sazetak;
            this.tockeDnevnogReda = new List<TockaDnevnogReda>();
        }

        public static List<Meeting> getMeetingsForBuilding(int buildingId)
        {
            List<Meeting> meetings = new List<Meeting>();
            var conn = Database.GetConnection();
            using (var cmd = new NpgsqlCommand("SELECT * FROM sastanak WHERE zgradaID = @buildingId", conn))
            {
                cmd.Parameters.AddWithValue("buildingId", buildingId);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    string? sazetak = reader.IsDBNull(0) ? null : reader.GetString(0);
                    DateTime vrijeme = reader.GetDateTime(1);
                    string mjesto = reader.GetString(2);
                    string status = reader.GetString(3);
                    int id = reader.GetInt32(4);
                    string naslov = reader.GetString(5);
                    int zgradaId = reader.GetInt32(6);
                    int kreatorId = reader.GetInt32(7);

                    meetings.Add(new Meeting(id, naslov, mjesto, vrijeme, status, zgradaId, kreatorId, sazetak));
                }
                reader.Close();
            }

            foreach (var meet in meetings){
                using (var cmd = new NpgsqlCommand("SELECT * FROM tocka_dnevnog_reda WHERE sastanakID = @meetingId", conn))
                {
                    cmd.Parameters.AddWithValue("meetingId", meet.meetingId);
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        string imeTocke = reader.GetString(0);
                        bool imaPravniUcinak = reader.GetBoolean(1);
                        string? sazetak = reader.IsDBNull(2) ? null : reader.GetString(2);
                        string? stanjeZakljucka = reader.IsDBNull(3) ? null : reader.GetString(3);
                        int id = reader.GetInt32(4);
                        string? url = reader.IsDBNull(5) ? null : reader.GetString(5);
                        int sastanakId = reader.GetInt32(6);

                        meet.tockeDnevnogReda.Add(new TockaDnevnogReda(id, imeTocke, imaPravniUcinak, sazetak, stanjeZakljucka, url, sastanakId));
                    }
                    reader.Close();
                }
            }
            
            return meetings;
        }

        public static Meeting getMeeting(int meetingId)
        {
            Meeting meeting = null;
            var conn = Database.GetConnection();
            using (var cmd = new NpgsqlCommand("SELECT * FROM sastanak WHERE sastanakID = @meetingId", conn))
            {
                cmd.Parameters.AddWithValue("meetingId", meetingId);
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    string? sazetak = reader.IsDBNull(0) ? null : reader.GetString(0);
                    DateTime vrijeme = reader.GetDateTime(1);
                    string mjesto = reader.GetString(2);
                    string status = reader.GetString(3);
                    int id = reader.GetInt32(4);
                    string naslov = reader.GetString(5);
                    int zgradaId = reader.GetInt32(6);
                    int kreatorId = reader.GetInt32(7);

                    meeting = new Meeting(id, naslov, mjesto, vrijeme, status, zgradaId, kreatorId, sazetak);
                }
                reader.Close();
            }

            using (var cmd = new NpgsqlCommand("SELECT * FROM tocka_dnevnog_reda WHERE sastanakID = @meetingId", conn))
            {
                cmd.Parameters.AddWithValue("meetingId", meetingId);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    string imeTocke = reader.GetString(0);
                    bool imaPravniUcinak = reader.GetBoolean(1);
                    string? sazetak = reader.IsDBNull(2) ? null : reader.GetString(2);
                    string? stanjeZakljucka = reader.IsDBNull(3) ? null : reader.GetString(3);
                    int id = reader.GetInt32(4);
                    string? url = reader.IsDBNull(5) ? null : reader.GetString(5);
                    int sastanakId = reader.GetInt32(6);

                    meeting.tockeDnevnogReda.Add(new TockaDnevnogReda(id, imeTocke, imaPravniUcinak, sazetak, stanjeZakljucka, url, sastanakId));
                    //Console.WriteLine("Tocka dnevnog reda: " + imeTocke);
                    
                }

                reader.Close();
            }

            return meeting;
        }

        public static bool changeMeetingState(string status,int meetingId)
        {
            try
            {
                var conn = Database.GetConnection();

                using (var transaction = conn.BeginTransaction())
                {

                    using (var cmd = new NpgsqlCommand("UPDATE sastanak SET statussastanka = @status WHERE sastanakid = @meetingId", conn))
                    {
                        cmd.Parameters.AddWithValue("meetingId", meetingId);
                        cmd.Parameters.AddWithValue("status", status);
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            transaction.Commit();
                            return true;
                        }
                        else
                        {
                            transaction.Rollback();
                            return false;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error deleting meeting: " + ex.Message);
                return false;
            }
        }
        public static bool joinMeeting(int zgradaId,int userId, int meetingId)
        {
            try
            {
                var conn = Database.GetConnection();

                using (var transaction = conn.BeginTransaction())
                {
                    using (var cmd = new NpgsqlCommand("INSERT INTO sudjelovanje (zgradaid,userid,sastanakid) VALUES (@zgradaid,@userid,@meetingid)", conn))
                    {
                        cmd.Parameters.AddWithValue("zgradaid", zgradaId);
                        cmd.Parameters.AddWithValue("userid", userId);
                        cmd.Parameters.AddWithValue("meetingid", meetingId);
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            transaction.Commit();
                            return true;
                        }
                        else
                        {
                            transaction.Rollback();
                            return false;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //Console.WriteLine("Error deleting meeting: " + ex.Message);
                return false;
            }
        }
        public static bool leaveMeeting(int zgradaId, int userId, int meetingId)
        {
            try
            {
                var conn = Database.GetConnection();

                using (var transaction = conn.BeginTransaction())
                {
                    using (var cmd = new NpgsqlCommand("DELETE FROM sudjelovanje WHERE zgradaid = @zgradaid AND userid = @userid AND sastanakid = @meetingid", conn))
                    {
                        cmd.Parameters.AddWithValue("zgradaid", zgradaId);
                        cmd.Parameters.AddWithValue("userid", userId);
                        cmd.Parameters.AddWithValue("meetingid", meetingId);
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            transaction.Commit();
                            return true;
                        }
                        else
                        {
                            transaction.Rollback();
                            return false;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error deleting meeting: " + ex.Message);
                return false;
            }
        }
        public static bool deleteMeeting(int meetingId)
        {
            try
            {
                var conn = Database.GetConnection();
                
                using (var transaction = conn.BeginTransaction())
                {
                    
                    using (var cmd = new NpgsqlCommand("DELETE FROM sastanak WHERE sastanakid = @meetingId", conn))
                    {
                        cmd.Parameters.AddWithValue("meetingId", meetingId);
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            transaction.Commit();
                            return true;
                        }
                        else
                        {
                            transaction.Rollback();
                            return false; 
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error deleting meeting: " + ex.Message);
                return false; 
            }
        }
        public static bool checkSudjelovanje(int zgradaId, int userId, int meetingId)
        {
            try
            {
                using (var conn = Database.GetConnection())
                {
                    using (var cmd = new NpgsqlCommand("SELECT COUNT(*) FROM sudjelovanje WHERE zgradaid = @zgradaid AND userid = @userid AND sastanakid = @meetingid", conn))
                    {
                        cmd.Parameters.AddWithValue("zgradaid", zgradaId);
                        cmd.Parameters.AddWithValue("userid", userId);
                        cmd.Parameters.AddWithValue("meetingid", meetingId);
                        int count = Convert.ToInt32(cmd.ExecuteScalar());
                        return count > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error checking sudjelovanje: " + ex.Message);
                return false;
            }
        }

        public static int checkSudioniciCount(int zgradaId, int meetingId)
        {
            try
            {
                using (var conn = Database.GetConnection())
                {
                    using (var cmd = new NpgsqlCommand("SELECT COUNT(*) FROM sudjelovanje WHERE zgradaid = @zgradaid AND sastanakid = @meetingid", conn))
                    {
                        cmd.Parameters.AddWithValue("zgradaid", zgradaId);
                        cmd.Parameters.AddWithValue("meetingid", meetingId);
                        int count = Convert.ToInt32(cmd.ExecuteScalar());
                        return count;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error checking sudionici count: " + ex.Message);
                return -1;
            }
        }
        public static bool addTockaDnevnogReda(int meetingId, TockaDnevnogRedaRequest tocka)
        {
            try
            {
                var conn = Database.GetConnection();

                using (var transaction = conn.BeginTransaction())
                {

                    using (var cmd = new NpgsqlCommand("INSERT INTO tocka_dnevnog_reda (imetocke, imapravniucinak, sazetakrasprave, stanjezakljucka, linknadiskusiju, sastanakid) VALUES (@imetocke, @imapravniucinak, @sazetakrasprave, @stanjezakljucka, @linknadiskusiju, @sastanakid)", conn))
                    {
                        cmd.Parameters.AddWithValue("imetocke", tocka.imeTocke);
                        cmd.Parameters.AddWithValue("imapravniucinak", tocka.imaPravniUcinak);
                        cmd.Parameters.AddWithValue("sazetakrasprave", tocka.sazetak ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("stanjezakljucka", tocka.stanjeZakljucka ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("linknadiskusiju", tocka.url ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("sastanakid", meetingId);
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            transaction.Commit();
                            return true;
                        }
                        else
                        {
                            transaction.Rollback();
                            return false;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error deleting tocka: " + ex.Message);
                return false;
            }
        }
        public static List<Meeting> getMeetings(int idZgrade, Status statusZgrada)
        {
            List<Meeting> meetings = new List<Meeting>();
            var conn = Database.GetConnection();
            // using (var cmd = new NpgsqlCommand("SELECT * FROM sastanak WHERE zgradaID = @zgradaId AND statussastanka = @status", conn))
            // {
            //     cmd.Parameters.AddWithValue("zgradaId", idZgrade);
            //     cmd.Parameters.AddWithValue("status", statusZgrada.ToString());
            //     var reader = cmd.ExecuteReader();
            //     while (reader.Read())
            //     {
            //         string? sazetak = reader.IsDBNull(0) ? null : reader.GetString(0);
            //         DateTime vrijeme = reader.GetDateTime(1);
            //         string mjesto = reader.GetString(2);
            //         string status = reader.GetString(3);
            //         int id = reader.GetInt32(4);
            //         string naslov = reader.GetString(5);
            //         int zgradaId = reader.GetInt32(6);
            //         int kreatorId = reader.GetInt32(7);

            //         meetings.Add(new Meeting(id, naslov, mjesto, vrijeme, status, zgradaId, kreatorId, sazetak));
            //     }
            //     reader.Close();
            // }
            List<int> meetingIds = new List<int>();
            using (var cmd = new NpgsqlCommand("SELECT sastanakId FROM sastanak WHERE zgradaID = @zgradaId AND statussastanka = @status", conn))
            {
                cmd.Parameters.AddWithValue("zgradaId", idZgrade);
                cmd.Parameters.AddWithValue("status", statusZgrada.ToString());
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    meetingIds.Add(reader.GetInt32(0));
                }
                reader.Close();
            }
            foreach(int meetingId in meetingIds)
            {
                meetings.Add(getMeeting(meetingId));
            }
            return meetings;
        }

        public static bool deleteTockeDnevnogReda(int meetingId)
        {
            var conn = Database.GetConnection();

            using (var cmd = new NpgsqlCommand("DELETE FROM tocka_dnevnog_reda WHERE sastanakid = @meetingId", conn))
            {
                cmd.Parameters.AddWithValue("meetingId", meetingId);
                int rowsAffected = cmd.ExecuteNonQuery();
                Console.WriteLine("Izbrisao ukupno " + rowsAffected + " tocaka dnevnog reda");
            }

            return true;
        }
    }
}
