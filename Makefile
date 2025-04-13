prerequisites:
	@eval command -v npm > /dev/null 2>&1 || (echo "npm is not installed" && exit 1)

# Lets other users on the network access the site to view
run:
	npm run develop -- --host=0.0.0.0

install:
	npm install --legacy-peer-deps

build: install
	npm run build

share:
	@echo $(shell hostname -I | awk '{print $$1}'):8000

serve:
	npm run serve

clean:
	npm run clean