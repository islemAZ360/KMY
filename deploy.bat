@echo off
git init
git add .
git commit -m "Optimize video playback and preloading"
git branch -M main
git remote remove origin || true
git remote add origin https://github.com/islemAZ360/KMY.git
git push origin main -f
echo Deployment complete.
