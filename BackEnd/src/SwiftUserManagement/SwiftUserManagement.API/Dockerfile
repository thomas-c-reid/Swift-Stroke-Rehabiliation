#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.
# This dockerfile is used to containerise the C# User Management Service

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build



WORKDIR /src
COPY ["SwiftUserManagement/SwiftUserManagement.API/SwiftUserManagement.API.csproj", "SwiftUserManagement/SwiftUserManagement.API/"]
COPY ["SwiftUserManagement/SwiftUserManagement.Application/SwiftUserManagement.Application.csproj", "SwiftUserManagement/SwiftUserManagement.Application/"]
COPY ["SwiftUserManagement/SwiftUserManagement.Domain/SwiftUserManagement.Domain.csproj", "SwiftUserManagement/SwiftUserManagement.Domain/"]
COPY ["SwiftUserManagement/SwiftUserManagement.Infrastructure/SwiftUserManagement.Infrastructure.csproj", "SwiftUserManagement/SwiftUserManagement.Infrastructure/"]
RUN dotnet restore "SwiftUserManagement/SwiftUserManagement.API/SwiftUserManagement.API.csproj"
COPY . .
WORKDIR "/src/SwiftUserManagement/SwiftUserManagement.API"
RUN dotnet build "SwiftUserManagement.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SwiftUserManagement.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SwiftUserManagement.API.dll"]