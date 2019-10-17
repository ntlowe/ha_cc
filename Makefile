.PHONY: install build test build-hot start view

# install dependencies
install:
	npm install

# transpile ts and build main.js package
build:
	npx webpack

# run unit tests
test:
	npm test

# for hot reload
# 	open separate shells for running `buildhot` and `start`

# transpile ts and build main.js package, watching for changes
build-hot:
	npx webpack --watch

# start dev server
start:
	npm run start:dev

# when dev server is running, change to appropriate browser if needed
view:
	open -a "Google Chrome" http://localhost:8080/