
prerequisites:
	@eval command -v npm > /dev/null 2>&1 || (echo "npm is not installed" && exit 1)
	
run:
	npm run --host=0.0.0.0 develop

install:
	npm install --legacy-peer-deps

build: install
	npm run build

serve:
	npm run serve

clean:
	npm run clean