# This script is intended to be run on a fresh self-hosted runner that will be used to deploy out
# the web app via github pages. Github actions will be used to handle restarting the docker containers.
# NOTE:
#   1. This script is mean to be run only once for setup

import sys
import os
import subprocess

dependencies = [
    "git",
    "docker",
    "docker-compose"
]

def check_dependencies():
    for dependency in dependencies:
        try:
            subprocess.run([dependency, "--version"], check=True)
        except subprocess.CalledProcessError:
            print(f"Error: {dependency} is not installed")
            sys.exit(1)

def is_valid_git_repo(repo_url):
    try:
        # Use git ls-remote to check if the repository exists and is accessible
        subprocess.run(["git", "ls-remote", repo_url], check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def main():
  # Make sure this runner has the necessary dependencies
  check_dependencies()

  # Must provide the https url to the repo that you are going to clone from. This may seem redundant, but it's
  # to prevent any inccorrect repoisitories getting cloned if this repository is forked.
  repo_url = None
  runner_working_dir = os.getcwd()
  save_dir = runner_working_dir
  os.chdir(runner_working_dir)

  # Script is meant to be run via curl, so we need sato manually parse the arguments to avoid needing dependencies
  for arg in sys.argv[1:]:
      if arg.startswith("--repo-url="):
          repo_url = arg.split("=", 1)[1]
      if arg.startswith("--runner-working-dir="):
          runner_working_dir = arg.split("=", 1)[1]

  # Check to make sure that the repo url is provided and valid
  if repo_url is None:
      print("Error: --repo-url is required")
      sys.exit(1)
  if not is_valid_git_repo(repo_url):
      print("Error: --repo-url is not a valid git repository")
      sys.exit(1)

  print(f"Setting up runner with repo: {repo_url} in working dir: {runner_working_dir}")
  os.makedirs(runner_working_dir, exist_ok=True)
  # Clone the repo in "dev" and "test" directories
  try:
      subprocess.run(["git", "clone", repo_url, "dev"])
      subprocess.run(["git", "clone", repo_url, "test"])
  except subprocess.CalledProcessError as e:
      print(f"Error: Failed to clone a repository: {e}")
      sys.exit(1)

  # Create github actions workflow files
  os.makedirs(".github/workflows", exist_ok=True)
  with open(".github/workflows/deploy.yml", "w") as f:
      f.write("""name: Deploy Application

on:
  push:
    branches:
      - '**'  # Matches any branch

jobs:
  deploy:
    runs-on: self-hosted

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # Always pull the latest branch and run it in the dev environment
      - name: Update and restart dev environment
        run: |
          export DEV_DIR=${{ github.workspace }}/dev
          cd dev
          git pull origin ${{ github.ref_name }}
          docker compose stop portfolio-website-dev
          docker compose up -d portfolio-website-dev

      - name: Update and restart test environment
        run: |
          export TEST_DIR=${{ github.workspace }}/test
          cd test
          git pull origin main
          docker compose stop portfolio-website-test
          docker compose up -d portfolio-website-test

      - name: Clean up old Docker images
        run: docker image prune -f""")

  # Create .env file
  with open(".env", "w") as f:
      f.write("""# Development environment settings
DEV_DIR=./
DEV_PORT=8000

# Test environment settings
TEST_DIR=./
TEST_PORT=8001
""")


  # Setup .gitignore file
  with open(".gitignore", "w") as f:
      f.write("""dev/
test/
.env
""")
        
  # Swap back to the original working directory
  os.chdir(save_dir)

if __name__ == "__main__":
    main()
