using Backend.Controllers;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests
{
    public class UserControllerTests
    {
        private readonly Mock<ILogger<UserController>> _mockLogger;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            _mockLogger = new Mock<ILogger<UserController>>();
            _controller = new UserController(_mockLogger.Object);
        }
        [Fact]
        public async Task ChangePassword_ReturnsUnauthorized_WhenNewPasswordIsUndefined()
        {
            var context = new DefaultHttpContext();
            context.Request.Headers["token"] = "validToken";
            _controller.ControllerContext.HttpContext = context;
            var request = new ChangePasswordRequest
            {
                oldPassword = "oldPassword123",
                newPassword = "undefined"
            };
            var result = await _controller.ChangePassword(request);
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid password", unauthorizedResult.Value.GetType().GetProperty("error")?.GetValue(unauthorizedResult.Value));
            Assert.Equal("The user password is invalid or has expired.", unauthorizedResult.Value.GetType().GetProperty("message")?.GetValue(unauthorizedResult.Value));
        }
        [Fact]
        public async Task ChangePassword_ReturnsUnauthorized_WhenOldPasswordIsUndefined()
        {
            var context = new DefaultHttpContext();
            context.Request.Headers["token"] = "validToken";
            _controller.ControllerContext.HttpContext = context;
            var request = new ChangePasswordRequest
            {
                oldPassword = "undefined",
                newPassword = "newPassword123"
            };
            var result = await _controller.ChangePassword(request);
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid password", unauthorizedResult.Value.GetType().GetProperty("error")?.GetValue(unauthorizedResult.Value));
            Assert.Equal("The user password is invalid or has expired.", unauthorizedResult.Value.GetType().GetProperty("message")?.GetValue(unauthorizedResult.Value));
        }
    }
}
