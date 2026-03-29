@echo off
git init
git add .
git commit -m "Fix Vercel build and Next button logic"
git branch -M main
git remote add origin https://github.com/islemAZ360/KMY.git
git push origin main -f
pause
