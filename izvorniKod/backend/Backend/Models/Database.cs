// File: ConsoleApp1/Database.cs
using Npgsql;

public static class Database
{
<<<<<<< HEAD
    private static string connString = "Host=dpg-csotlkhu0jms738psho0-a.frankfurt-postgres.render.com;Port=5432;Username=dev;Password=uUxLrHBxx9QDyrzExGKshF2KyAUhtzLT;Database=ezgrada_db";

    //private static readonly string connString = "Host=host.docker.internal;Username=dev;Password=baze;Database=eZgrada";

    //private static readonly string connString = "Host=localhost;Username=postgres;Password=baze;Database=eZgrada";
=======

    //s bazom online
    //private static readonly string connString = "Host=dpg-ctonallsvqrc73b9u04g-a.frankfurt-postgres.render.com;Port=5432;Username=dev;Password=WK9XC2jNA8bWzJmCfZULPiuLeBZDc0EH;Database=ezgrada_db_2ql1";

    //ako na dockeru se testira
    //private static readonly string connString = "Host=host.docker.internal;Username=dev;Password=baze;Database=eZgrada";

    //lokalna baza
    private static readonly string connString = "Host=localhost;Username=postgres;Password=baze;Database=eZgrada";
>>>>>>> origin/backend
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
