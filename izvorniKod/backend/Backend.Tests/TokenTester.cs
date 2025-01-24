using System;
using System.IdentityModel.Tokens.Jwt;
using Xunit;

public class JWTGeneratorTests
{
    [Fact]
    public void GenerateJwt_ShouldReturnValidToken()
    {
        string email = "test@example.com";
        string token = JWTGenerator.GenerateJwt(email);
        Assert.NotNull(token);
        Assert.NotEmpty(token);
        var handler = new JwtSecurityTokenHandler();
        var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

        Assert.NotNull(jsonToken); 
        var emailClaim = jsonToken?.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
        Assert.Equal(email, emailClaim);
    }
    [Fact]
    public void DecodeJwt_ShouldReturnEmptyString_ForExpiredToken()
    {
        string email = "expired@example.com";
        string expiredToken = JWTGenerator.GenerateJwt(email);
        System.Threading.Thread.Sleep(2000);
        string decodedEmail = JWTGenerator.DecodeJwt(expiredToken);
        Assert.Equal("", decodedEmail);
    }
    [Fact]
    public void ParseGoogleJwtToken_ShouldReturnEmail_WhenTokenIsValid()
    {
        string validGoogleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIn0.KtP3gJf9V5yFbfLJZ8hLR7NTnxG45NYCQO74wqIg32M";
        string email = JWTGenerator.ParseGoogleJwtToken(validGoogleJwt);
        Assert.Equal("test@gmail.com", email);
    }
    [Fact]
    public void ParseGoogleJwtToken_ShouldReturnEmptyString_WhenTokenIsInvalid()
    {
        string invalidGoogleJwt = "InvalidToken";
        string email = JWTGenerator.ParseGoogleJwtToken(invalidGoogleJwt);
        Assert.Equal("", email);
    }
}