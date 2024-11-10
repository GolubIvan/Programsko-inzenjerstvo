// File: ConsoleApp1/Database.cs
using Npgsql;

public static class Database
{
    private static readonly string connString = "Host=localhost;Username=postgres;Password=baze;Database=eZgrada";
    private static NpgsqlConnection? connection;

    public static NpgsqlConnection GetConnection()
    {
        if (connection == null)
        {
            connection = new NpgsqlConnection(connString);
            connection.Open();
        }
        return connection;
    }
}
