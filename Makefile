export PATH  := node_modules/.bin:$(PATH)

all:build

build:
	browserify www/app/app.js | uglifyjs -mc > www/assets/bundle.js

watch:
	watchify www/app/app.js -o www/assets/bundle.js -v

clean:
	rm -rf www/assets/bundle*.js


.PHONY: all build watch
