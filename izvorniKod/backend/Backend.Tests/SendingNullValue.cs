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
    public class MeetingControllerTests
    {
        private readonly Mock<ILogger<MeetingController>> _mockLogger;
        private readonly MeetingController _controller;
        public MeetingControllerTests()
        {
            _mockLogger = new Mock<ILogger<MeetingController>>();
            _controller = new MeetingController(_mockLogger.Object);
        }
        [Fact]
        public void CreateMeeting_ReturnsBadRequest_WhenMeetingRequestIsNull()
        {
            var context = new DefaultHttpContext();
            var headers = new HeaderDictionary();
            context.Request.Headers["token"] = "validToken";
            _controller.ControllerContext.HttpContext = context;
            var result = _controller.CreateMeeting(null);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid data", badRequestResult.Value.GetType().GetProperty("error").GetValue(badRequestResult.Value));
        }
    }
}
