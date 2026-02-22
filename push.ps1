# push.ps1 - Build, deploy to GitHub Pages, and commit+push in one shot
param(
    [string]$Message = "Update site content"
)

# 1. Build deploy folder
Write-Host "Building..." -ForegroundColor Cyan
if (Test-Path "deploy") { Remove-Item "deploy" -Recurse -Force }
New-Item -ItemType Directory -Path "deploy/marketplace" | Out-Null
Get-ChildItem "public" | ForEach-Object { Copy-Item $_.FullName "deploy/$($_.Name)" }
npm run build
Copy-Item "dist/*" "deploy/marketplace" -Recurse
New-Item "deploy/.nojekyll" -ItemType File | Out-Null
Set-Content "deploy/CNAME" "davidgao.ca"

# 2. Deploy to GitHub Pages
Write-Host "Deploying to GitHub Pages..." -ForegroundColor Cyan
npx gh-pages -d deploy

# 3. Commit and push source
Write-Host "Committing..." -ForegroundColor Cyan
git add -A
git commit -m $Message
git push

Write-Host "Done! Live at davidgao.ca" -ForegroundColor Green
