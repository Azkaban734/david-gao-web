# commit.ps1 - Stage, commit, and push all changes
param(
    [string]$Message = "Update site content"
)

git add -A
git commit -m $Message
git push

Write-Host "Pushed to GitHub!" -ForegroundColor Green
