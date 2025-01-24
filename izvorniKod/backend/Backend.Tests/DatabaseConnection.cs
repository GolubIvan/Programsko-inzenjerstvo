using System;
using Xunit;
using Npgsql;

public class DatabaseTests
{
    [Fact]
    public async Task GetConnection_ShouldOpenConnectionAsync()
    {
        try
        {
            using (var connection = await Database.GetConnectionAsync())
            {
                Assert.NotNull(connection); 
                Assert.Equal(System.Data.ConnectionState.Open, connection.State); 
            }
        }
        catch (Exception ex)
        {
            Assert.False(true, $"Exception thrown: {ex.Message}");
        }
    }

}
