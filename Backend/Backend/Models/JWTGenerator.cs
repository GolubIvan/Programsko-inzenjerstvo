using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.ComponentModel.DataAnnotations;

public class JWTGenerator
{
    private const string SecretKey = "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";

    public static string GenerateJwt(string email)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Exp, DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds().ToString()),
            new Claim(JwtRegisteredClaimNames.Iss, "your-app"),
            new Claim(JwtRegisteredClaimNames.Aud, "your-app-users"),
            new Claim("email", email)
        };

        var jwtToken = new JwtSecurityToken(
            issuer: "your-app",
            audience: "your-app-users",
            claims: claims,
            expires: DateTime.UtcNow.AddSeconds(1),
            signingCredentials: credentials);

        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(jwtToken);
    }

    public static string DecodeJwt(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            // Parametri validacije tokena
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true, // Provjerava da nije expired
                ValidateIssuerSigningKey = true,
                ValidIssuer = "your-app",
                ValidAudience = "your-app-users",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey))
            };

            // Validacija
            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

            // Ako validacija uspjesna, vjeruje se tokenu
            var claimsDictionary = new Dictionary<string, string>();
            foreach (var claim in principal.Claims)
            {
                if (claim.Type == "email")
                {
                    return claim.Value;
                }
            }

            return "";
        }
        catch (SecurityTokenException)
        {
            // Ako validacija nije uspjesna (ili ako je expired)
            return "";
        }
    }

    public static string ParseGoogleJwtToken(string googleJwtToken)
    {
        string email = "";
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(googleJwtToken) as JwtSecurityToken;
            
            if (jsonToken != null && jsonToken.Payload.ContainsKey("email"))
            {
                // Extract claims from the payload
                email = jsonToken?.Payload["email"]?.ToString();
            }
            else
            {
                Console.WriteLine("Invalid token");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error parsing token: " + ex.Message);
            return email;
        }
        return email;
    }
}
