# This script is intended to be run on a fresh self-hosted runner that will be used to deploy out
# the web app via github pages. Github actions will be used to handle restarting the docker containers.
# NOTE:
#   1. This script is mean to be run only once for setup

import sys
import os
import subprocess

dependencies = [
    "git --version",
    "docker --version",
    "docker compose version"
]

def check_dependencies():
    for dependency in dependencies:
        try:
            subprocess.run(dependency.split(' '), check=True)
        except subprocess.CalledProcessError:
            command = ' '.join(dependency.split(' ')[:-1])
            print(f"Error: {command} is not installed")
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
    working_dir = os.getcwd()
    save_dir = working_dir
    os.chdir(working_dir)

    # Script is meant to be run via curl, so we need to manually parse the arguments to avoid needing dependencies
    for arg in sys.argv[1:]:
        if arg.startswith("--repo-url="):
            repo_url = arg.split("=", 1)[1]
        if arg.startswith("--runner-working-dir="):
            working_dir = arg.split("=", 1)[1]

    # Check to make sure that the repo url is provided and valid
    if repo_url is None:
        print("Error: --repo-url is required")
        sys.exit(1)
    if not is_valid_git_repo(repo_url):
        print("Error: --repo-url is not a valid git repository")
        sys.exit(1)

    print(f"Setting up runner with repo: {repo_url} in working dir: {working_dir}")
    os.makedirs(working_dir, exist_ok=True)
    # Clone the repo in "dev" and "test" directories
    try:
        subprocess.run(["git", "clone", repo_url, "dev"])
        subprocess.run(["git", "clone", repo_url, "test"])
    except subprocess.CalledProcessError as e:
        print(f"Error: Failed to clone a repository: {e}")
        sys.exit(1)

    # Create github actions workflow files
    os.makedirs(".github/workflows", exist_ok=True)
    with open(".github/workflows/deploy.yaml", "w") as f:
        f.write(f"""name: Deploy Application

on:
  push:
    branches:
      - '**'

jobs:
  deploy:
    runs-on: self-hosted

    env:
      REPO_DIR: /mnt/home_lab/danis-portfolio-website-cd
      BRANCH_NAME: ${{{{ github.ref_name }}}}

    steps:
      - name: Update and restart dev environment
        run: |
          cd "$REPO_DIR/dev"
          git checkout "$BRANCH_NAME" || git fetch origin "$BRANCH_NAME" && git checkout "$BRANCH_NAME"
          git pull origin "$BRANCH_NAME"
          make docker-stop-dev
          make docker-run-dev

      - name: Update and restart test environment
        run: |
          cd "$REPO_DIR/test"
          git checkout main
          git pull origin main
          make build
          make docker-stop-test
          make docker-run-test

      - name: Clean up old Docker images
        run: docker image prune -f
""")

    # Create .env file
    with open(".env", "w") as f:
        f.write("""# Development environment settings
DEV_DIR=./dev
DEV_PORT=8000

# Test environment settings
TEST_DIR=./test
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
