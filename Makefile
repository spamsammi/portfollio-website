# Default port is 8000, can be overridden with PORT=xxxx
PORT ?= 8000

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

docker-build:
	./docker/build.sh