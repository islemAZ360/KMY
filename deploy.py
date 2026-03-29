import subprocess
import os

repo_path = r"c:\Users\1\OneDrive\Desktop\my own projects\кму"
remote_url = "https://github.com/islemAZ360/KMY.git"

print(f"Switching to {repo_path}")
os.chdir(repo_path)

def run_git(args):
    result = subprocess.run(["git"] + args, capture_output=True, text=True, encoding='utf-8')
    print(f"Running: git {' '.join(args)}")
    if result.stdout: print(result.stdout)
    if result.stderr: print(result.stderr)
    return result

# 1. Init
run_git(["init"])

# 2. Add
run_git(["add", "."])

# 3. Commit
run_git(["commit", "-m", "Initial Professional KMU Presentation Release"])

# 4. Branch
run_git(["branch", "-M", "main"])

# 5. Remote (Clear if exists)
subprocess.run(["git", "remote", "remove", "origin"])
run_git(["remote", "add", "origin", remote_url])

# 6. Push
print("Pushing to GitHub...")
run_git(["push", "-u", "origin", "main", "-f"])

print("Done.")
