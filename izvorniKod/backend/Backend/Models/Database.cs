// File: ConsoleApp1/Database.cs
using Npgsql;

public static class Database
{
    private static string connString = "Host=dpg-csotlkhu0jms738psho0-a.frankfurt-postgres.render.com;Port=5432;Username=dev;Password=uUxLrHBxx9QDyrzExGKshF2KyAUhtzLT;Database=ezgrada_db";

    //private static readonly string connString = "Host=host.docker.internal;Username=dev;Password=baze;Database=eZgrada";

    //private static readonly string connString = "Host=localhost;Username=postgres;Password=baze;Database=eZgrada";
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
