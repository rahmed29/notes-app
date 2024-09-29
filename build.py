import os
import subprocess
import sys

# Set up arguments
commitMessage = ""

try:
    commitMessage = sys.argv[1]
except IndexError:
    pass

# Fill in missing directories
if not os.path.exists("./micromark-extension-mark"):
    print(f"Cloning micromark-extension-mark")
    subprocess.run(["git clone https://github.com/rahmed29/micromark-extension-mark ./micromark-extension-mark"], shell=True)

if not os.path.exists("./public/assets/prism-all-themes"):
    print(f"Cloning prism themes")
    subprocess.run(["git clone https://github.com/rahmed29/prism-all-themes ./public/assets/prism-all-themes"], shell=True)

if not os.path.exists("./public/assets/ace-editor"):
    print(f"Cloning Ace Editor")
    subprocess.run(["git clone https://github.com/ajaxorg/ace-builds.git"], shell=True)
    subprocess.run(["mv ./ace-builds/src-min ./public/assets/ace-editor"], shell=True)
    subprocess.run(["rm -rf ./ace-builds"], shell=True)

if not os.path.exists("./public/uploads"):
    print(f"Creating user uploads folder")
    subprocess.run(["mkdir ./public/uploads"], shell=True)

if not os.path.exists("./export"):
    print(f"Creating export folder")
    subprocess.run(["mkdir ./export"], shell=True)

# build
subprocess.run(["npm run build"], shell=True) 

# remove old assets
indexHtml = open("./dist/index.html").read()
fdgHtml = open("./views/fdg.ejs").read()
newAssets = os.listdir("./dist/assets")

for file in newAssets:
   if (os.path.splitext(file)[1] == ".js" or os.path.splitext(file)[1] == ".css") and file not in indexHtml and file not in fdgHtml:
       subprocess.run([f"rm ./dist/assets/{file}"], shell=True)
       print(f"Removed {file}")

# move files
subprocess.run(["rm ./views/desktop.ejs"], shell=True)
print(f"Removed ./views/desktop.ejs")
subprocess.run(["mv ./dist/index.html ./views/desktop.ejs"], shell=True)
print(f"Moved ./dist/index.html to ./views/desktop.ejs")
# subprocess.run(["mv ./dist/canvas.html ./views/canvas.ejs"], shell=True)
# print(f"Moved ./dist/canvas.html to ./canvas/desktop.ejs")
subprocess.run(["rm -rf ./public"], shell=True)
print(f"Removed ./public")
subprocess.run(["mv ./dist ./public"], shell=True)
print(f"Moved ./dist to ./public")

# git commit and push if commit message argument was provided
if commitMessage != "":
    print(f"Committing with message: {commitMessage}")
    subprocess.run(["git add ."], shell=True)
    subprocess.run([f"git commit -m \"{commitMessage}\""], shell=True)
    subprocess.run(["git push"], shell=True)