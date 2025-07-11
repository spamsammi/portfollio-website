# Default port is 8000, can be overridden with PORT=xxxx
PORT ?= 8000

PROJECT_DIR := $(CURDIR)
BRANCH_NAME := main
ENV_FILE := # Leave blank for default environment, or set to "--env-file <directory>/.env" for custom env file
DOCKER_COMPOSE := docker compose --project-directory $(PROJECT_DIR) -f docker/docker-compose.yaml $(ENV_FILE)

prerequisites:
	@eval command -v npm > /dev/null 2>&1 || (echo "npm is not installed" && exit 1)

install:
	npm install --legacy-peer-deps

clean:
	npm run clean

# Dev mode - let other users on the network access the site to view with hot reloading enabled
run:
	npm run develop -- --host=0.0.0.0 --port=$(PORT)

# Serve mode - let other users on the network access the site to view like it would be in production
serve:
	npm run serve -- --host=0.0.0.0 --port=$(PORT)

build: install
	npm run build

### Docker ###
# Both dev and test
docker-build:
	$(DOCKER_COMPOSE) build

docker-run:
	$(DOCKER_COMPOSE) up --build -d

docker-stop:
	$(DOCKER_COMPOSE) stop

docker-remove: docker-stop
	$(DOCKER_COMPOSE) rm -f

# dev
docker-run-dev:
	$(DOCKER_COMPOSE) up --build -d dev

docker-stop-dev:
	$(DOCKER_COMPOSE) stop dev

docker-remove-dev: docker-stop-dev
	$(DOCKER_COMPOSE) rm -f dev

# test
docker-run-test:
	$(DOCKER_COMPOSE) up --build -d test

docker-stop-test:
	$(DOCKER_COMPOSE) stop test

docker-remove-test: docker-stop-test
	$(DOCKER_COMPOSE) rm -f test

### Runner ###
# WARNING: This will override all changes made and checkout the branch given by BRANCH_NAME (default is main)
force-update:
	git fetch origin
	git checkout -f $(BRANCH_NAME)
	git reset --hard origin/$(BRANCH_NAME)