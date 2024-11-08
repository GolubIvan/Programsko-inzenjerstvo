using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

public class JWTGenerator
{
    private const string SecretKey = "V7e!$@r2jLe#fQrD1!lU8mNpG^zHsT8@";

    public static string GenerateJwt(int userId)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Exp, DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds().ToString()),
            new Claim(JwtRegisteredClaimNames.Iss, "your-app"),
            new Claim(JwtRegisteredClaimNames.Aud, "your-app-users"),
            new Claim("id", userId.ToString())
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

    public static int DecodeJwt(string token)
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
                if (claim.Type == "id")
                {
                    if (int.TryParse(claim.Value, out int number))
                    {
                        return number;
                    }
                }
            }

            return -1;
        }
        catch (SecurityTokenException)
        {
            // Ako validacija nije uspjesna (ili ako je expired)
            return -1;
        }
    }
}
