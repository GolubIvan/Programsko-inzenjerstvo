# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release

# Set the working directory for the container
WORKDIR /app

# Copy the Backend.csproj into the container (relative to the Backend/Backend directory)
COPY ["Backend.csproj", "Backend/"]

# Restore dependencies for the Backend project
RUN dotnet restore "Backend/Backend.csproj"

# Copy the rest of the source code into the container
COPY . ./Backend/

# Set the working directory to the Backend folder where the project is located
WORKDIR /app/Backend

# Build the project
RUN dotnet build "Backend.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release

# Publish the project
RUN dotnet publish "Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app

# Copy the published files from the publish stage
COPY --from=publish /app/publish .

# Set the entry point to run the application
ENTRYPOINT ["dotnet", "Backend.dll"]
