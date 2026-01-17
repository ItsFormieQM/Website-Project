@echo off
setlocal

FOR /F "delims=" %%b IN ('git branch --show-current') DO set BRANCH=%%b

git add .
git commit -m "Force auto commit" 2>nul
git push origin %BRANCH% --force

echo Force pushed to GitHub (%BRANCH%).
pause
