// File: ConsoleApp1/Database.cs
using Npgsql;

public static class Database
{

    //s bazom online
    private static readonly string connString = "Host=dpg-cu7nt9rqf0us73e6p1dg-a.frankfurt-postgres.render.com;Database=ezgrada;Port=5432;Username=dev;Password=6EiJMXPyXUog1BUgfJW8KWhWsKYxrXvM";

    //ako na dockeru se testira
    //private static readonly string connString = "Host=host.docker.internal;Username=dev;Password=baze;Database=eZgrada";

    //lokalna baza
    //private static readonly string connString = "Host=localhost;Username=postgres;Password=baze;Database=eZgrada";
    private static NpgsqlConnection? connection;

    public static NpgsqlConnection GetConnection()
    {
            connection = new NpgsqlConnection(connString);
            connection.Open();
        return connection;
    }
}
