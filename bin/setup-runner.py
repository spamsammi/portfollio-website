# This script is intended to be run on a fresh self-hosted runner that will be used to deploy out
# the web app via github pages. Github actions will be used to handle restarting the docker containers.
# NOTE:
#   1. This script is mean to be run only once for setup

import sys
import os
import subprocess
import shutil

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
    images_path = "src/images/"
    save_dir = working_dir

    # Script is meant to be run via curl, so we need to manually parse the arguments to avoid needing dependencies
    for arg in sys.argv[1:]:
        if arg.startswith("--repo-url="):
            repo_url = arg.split("=", 1)[1]
        elif arg.startswith("--runner-working-dir="):
            working_dir = arg.split("=", 1)[1]
        elif arg.startswith("--images-path="):
            images_path = arg.split("=", 1)[1]
        else:
            print(f"Error: Unknown argument: {arg}")
            sys.exit(1)
            
    # Set to the absolute path for the runner working directory (needed for github actions)
    working_dir = os.path.abspath(working_dir)
    os.chdir(working_dir)

    # Check to make sure that the repo url is provided and valid
    if repo_url is None:
        print("Error: --repo-url is required")
        sys.exit(1)
    if not is_valid_git_repo(repo_url):
        print("Error: --repo-url is not a valid git repository")
        sys.exit(1)

    print(f"Setting up runner with repo: {repo_url} in working dir: {working_dir}")
    os.makedirs(working_dir, exist_ok=True)
    
    # Clone the repo in "dev" and "test" directories, or update them if they already exist
    for env in ["dev", "test"]:
        if not os.path.exists(env):
            try:
                subprocess.run(["git", "clone", repo_url, env], check=True)
            except subprocess.CalledProcessError as e:
                print(f"Error: Failed to clone repository into {env}: {e}")
                sys.exit(1)
        else:
            print(f"Directory '{env}' already exists. Updating repository...")
            try:
                subprocess.run(["git", "-C", env, "fetch", "origin"], check=True)
                subprocess.run(["git", "-C", env, "checkout", "-f", "main"], check=True)
                subprocess.run(["git", "-C", env, "reset", "--hard", f"origin/main"], check=True)
            except subprocess.CalledProcessError as e:
                print(f"Error: Failed to update repository in {env}: {e}")
                sys.exit(1)

    # Create/update github actions workflow files
    os.makedirs(".github/workflows", exist_ok=True)
    with open(".github/workflows/deploy.yaml", "w") as f:
        f.write(f"""name: Deploy Application

on:
  push:
  workflow_dispatch:
  repository_dispatch:

jobs:
  deploy:
    runs-on: self-hosted

    env:
      REPO_DIR: {working_dir}
      BRANCH_NAME: ${{{{ github.event.client_payload.branch || github.event.repository.default_branch }}}}

    steps:
      - name: Update and restart dev environment
        run: |
          cd "$REPO_DIR/dev"
          make force-update BRANCH_NAME=$BRANCH_NAME
          make docker-stop-dev
          make docker-run-dev

      - name: Update and restart test environment
        run: |
          cd "$REPO_DIR/test"
          make force-update
          make docker-stop-test
          make docker-run-test

      - name: Clean up old Docker images
        run: docker image prune -f
""")

    # Create/update .env file
    with open(".env", "w") as f:
        f.write(f"""# Development environment settings
DEV_DIR={working_dir}/dev
DEV_PORT=8000

# Test environment settings
TEST_DIR={working_dir}/test
TEST_PORT=8001

# Configuration settings
CONFIG_PATH={working_dir}/config.yaml
IMAGES_PATH={working_dir}/{images_path}
""")
        
    # Create the images directory and add a .gitkeep file to it
    os.makedirs(images_path, exist_ok=True)
    open(os.path.join(images_path, ".gitkeep"), "w").close()

    # Create a default config.yaml file if one does not exist; copy the one from dev/default-config.yaml
    if not os.path.exists(os.path.join(working_dir, "config.yaml")):
        shutil.copy(os.path.join(working_dir, "dev", "default-config.yaml"), os.path.join(working_dir, "config.yaml"))

    # Create/update .gitignore file
    with open(".gitignore", "w") as f:
        f.write("""dev/
test/
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.webp
*.ico
*.bmp
""")
        
    # Create/update Makefile
    with open(os.path.join(working_dir, "Makefile"), "w") as f:
        f.write("""docker-run:
	make -C dev docker-run-dev ENV_FILE="--env-file ../.env"
	make -C test docker-run-test ENV_FILE="--env-file ../.env"

docker-stop:
	make -C dev docker-stop-dev
	make -C test docker-stop-test

docker-remove:
	make -C dev docker-remove-dev
	make -C test docker-remove-test
""")
        
    # Swap back to the original working directory
    os.chdir(save_dir)

if __name__ == "__main__":
    main()
