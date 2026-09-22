# ==============================================================================
# Freelancer Secure360 - Microservices & Frontend Launch Script
# ==============================================================================
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting Freelancer Secure360 Platform (with Eureka)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $baseDir "Backend"
$frontendDir = Join-Path $baseDir "Frontend"

$wrapper = "C:\Users\91814\.m2\wrapper\dists\apache-maven-3.9.12-bin\5nmfsn99br87k5d4ajlekdq10k\apache-maven-3.9.12\bin\mvn.cmd"
$mvnCmd = if (Test-Path $wrapper) { "`"$wrapper`"" } else { "mvn" }

# Function to launch a spring-boot service in separate window
function Start-ServiceWindow {
    param(
        [string]$title,
        [string]$modulePath,
        [int]$port
    )
    Write-Host "Launching $title on port $port..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$modulePath'; Write-Host '--- Starting $title on port $port ---' -ForegroundColor Green; & $mvnCmd spring-boot:run"
}

# 1. Start Eureka Server First (Service Discovery Registry)
Start-ServiceWindow "Eureka Server (Registry)" (Join-Path $backendDir "eureka-server") 8761
Write-Host "Waiting 8 seconds for Eureka Server to initialize..." -ForegroundColor DarkGray
Start-Sleep -Seconds 8

# 2. Start Core Microservices (Registering with Eureka)
Start-ServiceWindow "Auth & User Service (with Common DTOs)" (Join-Path $backendDir "auth-user-service") 8081
Start-Sleep -Seconds 3

Start-ServiceWindow "Project & Equipment Service" (Join-Path $backendDir "project-equipment-service") 8082
Start-Sleep -Seconds 3

Start-ServiceWindow "Risk Underwriting Service" (Join-Path $backendDir "risk-underwriting-service") 8083
Start-Sleep -Seconds 3

Start-ServiceWindow "Policy Service" (Join-Path $backendDir "policy-service") 8084
Start-Sleep -Seconds 3

Start-ServiceWindow "Claim Service" (Join-Path $backendDir "claim-service") 8085
Start-Sleep -Seconds 3

# 3. Start API Gateway (Routes through Eureka lb://)
Start-ServiceWindow "API Gateway (Eureka Load Balanced)" (Join-Path $backendDir "api-gateway") 8080
Start-Sleep -Seconds 3

# 4. Start Frontend
Write-Host "Launching Angular Frontend on http://localhost:4200..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; Write-Host '--- Starting Angular Frontend (port 4200) ---' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " All services have been launched in separate terminal windows!" -ForegroundColor Green
Write-Host " Frontend App:      http://localhost:4200" -ForegroundColor White
Write-Host " Eureka Dashboard:  http://localhost:8761" -ForegroundColor White
Write-Host " API Gateway:       http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host " Demo Credentials:" -ForegroundColor Yellow
Write-Host "   Freelancer:  priya@example.com / Secure@123" -ForegroundColor White
Write-Host "   Underwriter: admin@secure360.com / Admin@123" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
