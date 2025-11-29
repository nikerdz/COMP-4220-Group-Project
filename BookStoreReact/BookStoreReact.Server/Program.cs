using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// 1) Add controllers
builder.Services.AddControllers();

// 2) Add CORS so React can call the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();  // Dev-friendly
    });
});

// 3) Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4) Swagger only in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 5) HTTPS + Routing + CORS
app.UseHttpsRedirection();

app.UseCors("AllowClient");

app.UseAuthorization();

// 6) Map all API controllers
app.MapControllers();

app.Run();
