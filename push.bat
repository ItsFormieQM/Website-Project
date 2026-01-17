@echo off
setlocal

git add .
git commit -m "Auto commit" 2>nul
git push origin main

echo Code pushed to GitHub.
pause
