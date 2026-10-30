# Test Shiprocket API with PowerShell
$body = @{
    email = "shraygupta8010@gmail.com"
    password = "IM3t$UhKhZ0PDr^F&H6Kl*uTl5c22WSM"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    Write-Host "Testing Shiprocket Authentication..." -ForegroundColor Yellow
    Write-Host "Email: shraygupta8010@gmail.com" -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri "https://apiv2.shiprocket.in/v1/external/auth/login" -Method Post -Body $body -Headers $headers
    
    Write-Host "`n✅ SUCCESS! Authentication worked!" -ForegroundColor Green
    Write-Host "Token received: $($response.token.Substring(0, 30))..." -ForegroundColor Green
    Write-Host "`nFull Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json
} catch {
    Write-Host "`n❌ FAILED!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
