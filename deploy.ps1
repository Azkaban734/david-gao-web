# deploy.ps1 - Build and deploy to GitHub Pages
Write-Host "Building deploy folder..." -ForegroundColor Cyan

# Clean and recreate deploy folder
if (Test-Path "deploy") { Remove-Item "deploy" -Recurse -Force }
New-Item -ItemType Directory -Path "deploy/marketplace" | Out-Null

# Copy portfolio assets to deploy root
Get-ChildItem "public" | ForEach-Object {
    Copy-Item $_.FullName "deploy/$($_.Name)"
}

# Build React app
npm run build

# Copy built React app to deploy/marketplace
Copy-Item "dist/*" "deploy/marketplace" -Recurse

# Add GitHub Pages files
New-Item "deploy/.nojekyll" -ItemType File | Out-Null
Set-Content "deploy/CNAME" "davidgao.ca"

# Deploy to GitHub Pages
npx gh-pages -d deploy

Write-Host "Deployed to GitHub Pages!" -ForegroundColor Green
