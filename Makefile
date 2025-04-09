
prerequisites:
	@eval command -v npm > /dev/null 2>&1 || (echo "npm is not installed" && exit 1)
	
run:
	npm run develop

build:
	npm run build

serve:
	npm run serve

clean:
	npm run clean