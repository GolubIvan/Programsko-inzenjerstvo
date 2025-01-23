using Backend.Controllers;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using System.Collections.Generic;

public class BuildingControllerTests
{
    [Fact]
    public void GetAllBuildings_ReturnsOk_WithValidBuildings()
    {
        // Arrange
        var mockLogger = new Mock<ILogger<BuildingController>>();

        // Mock the token parsing and Zgrada.getAllBuildings behavior
        var validToken = "valid-token";
        var validEmail = "user@example.com";
        var buildings = new List<Zgrada>
        {
            new Zgrada { zgradaId = 1, address = "123 Main St" },
            new Zgrada { zgradaId = 2, address = "456 Elm St" }
        };

        // Mock JWTGenerator behavior
        Mock<JWTGenerator> mockJwtGenerator = new Mock<JWTGenerator>();
        JWTGenerator.ParseGoogleJwtToken = token => validEmail; // Mocking static method

        // Mock Zgrada.getAllBuildings behavior
        Mock<Zgrada> mockZgrada = new Mock<Zgrada>();
        Zgrada.getAllBuildings = () => buildings; // Mocking static method

        var controller = new BuildingController(mockLogger.Object);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Headers["token"] = validToken;

        // Act
        var result = controller.GetAllBuildings() as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
        var resultValue = result.Value as dynamic;
        Assert.NotNull(resultValue);
        Assert.Equal(2, ((List<Zgrada>)resultValue.zgrade).Count);
    }
}
