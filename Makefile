export PATH  := node_modules/.bin:$(PATH)

ASSETS := www/assets
DIST := $(ASSETS)/dist

css_files	   := $(filter-out $(ASSETS)/css/style.css, $(wildcard $(ASSETS)/css/*.css))
css_components := $(wildcard $(ASSETS)/css/components/*.css)

all:build

build:
	browserify www/app/app.js | uglifyjs -mc > www/assets/bundle.js

css: $(css_files) $(css_components)
	@echo "Removing old CSS folder ...."
	rm -rf $(DIST) && mkdir $(DIST)

	@echo "Building CSS ...."
	cat $^ > $(DIST)/style.min.css

watch:
	watchify www/app/app.js -o www/assets/bundle.js -v

print-vars:
	@echo $(css_files)
	@echo $(css_components)

clean:
	@echo "Removing build files ...."
	rm -rf $(DIST)


.PHONY: all build watch print-vars
