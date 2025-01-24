using Backend.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using Xunit;
using Microsoft.AspNetCore.Http;
using Backend.Models;
using Microsoft.Extensions.Logging;

namespace Backend.Tests
{
    public class MeetingControllerTests2
    {
        private readonly Mock<ILogger<MeetingController>> _mockLogger;
        private readonly MeetingController _controller;

        public MeetingControllerTests2()
        {
            _mockLogger = new Mock<ILogger<MeetingController>>();
            _controller = new MeetingController(_mockLogger.Object);
        }

        [Fact]
        public void GetMeeting_ReturnsUnauthorized_WhenTokenIsMissing()
        {
            var context = new DefaultHttpContext();
            _controller.ControllerContext.HttpContext = context;
            var result = _controller.GetMeeting(1);
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var responseValue = unauthorizedResult.Value;
            Assert.NotNull(responseValue);
            Assert.Equal("Invalid token", responseValue.GetType().GetProperty("error")?.GetValue(responseValue));
            Assert.Equal("The user token is invalid or has expired.", responseValue.GetType().GetProperty("message")?.GetValue(responseValue));
        }

    }
}
