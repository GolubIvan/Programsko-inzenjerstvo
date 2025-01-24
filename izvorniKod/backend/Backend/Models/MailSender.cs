using System;
using System.Net;
using System.Net.Mail;

using Npgsql;

namespace Backend.Models
{
    class MailSender
    {
        public static void SendEmail(string toAddress, string subject, string body)
        {
            // Podaci za slanje
            var fromAddress = new MailAddress("ezgradafer@gmail.com", "EZ Grada FER");
            var toMailAddress = new MailAddress(toAddress);

            // Gmail SMTP server postavke
            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com", // Gmail SMTP server
                Port = 587, // Standardni SMTP port za Gmail
                EnableSsl = true, // Omogući SSL (sigurna veza)
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("ezgradafer@gmail.com", "stge hdzp owwb kqmf ") 
            };

            // Slanje emaila
            using (var message = new MailMessage(fromAddress, toMailAddress)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = false // Ako želiš slati HTML email, postavi na true
            })
            {
                try
                {
                    smtp.Send(message);
                    Console.WriteLine("Email successfully sent to " + toAddress);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Failed to send email: " + ex.Message);
                }
            }
        }
    }
}