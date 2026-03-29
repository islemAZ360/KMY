@echo off
git init
git add .
git commit -m "Initialize Professional KMU Presentation Project"
git branch -M main
git remote add origin https://github.com/islemAZ360/KMY.git
git push origin main -f
pause
