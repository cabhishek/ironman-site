export PATH  := node_modules/.bin:$(PATH)

# Root path to asset files
ASSETS := www/assets

# Root path for assets files after build
BUILD_DIR := www/build
BUILD_SUBDIR := $(BUILD_DIR)/css $(BUILD_DIR)/css/vendor

# Main Datathletics CSS file
SITE_CSS := /css/style.css

# All static content linking go here
LAYOUT_HTML := ./www/templates/layout.html

# Vendor files
VENDOR_CSS := /css/vendor/bootstrap.css

TIMSTAMP := $$(date +'%Y%m%d%H%M%S')

CACHE_BUSTER := $(subst %,$(TIMSTAMP),?v=%)

all:build

build:

	@sed -i '' 's/style.css/style.css${CACHE_BUSTER}/g' $(LAYOUT_HTML)


	@echo "Done adding cache buster ...."

	@echo "Build started ...."
	@echo "NODE_ENV =>" $(NODE_ENV)

	@rm -rf $(BUILD_DIR) && mkdir $(BUILD_DIR) && mkdir $(BUILD_SUBDIR)
	@echo "Removed old CSS folder ...."

	@cp -r $(ASSETS)/images $(BUILD_DIR)/images

	@myth -c $(ASSETS)/$(SITE_CSS) > $(BUILD_DIR)$(SITE_CSS)$(CACHE_BUSTER)
	@myth -c $(ASSETS)/$(VENDOR_CSS) > $(BUILD_DIR)$(VENDOR_CSS)$(CACHE_BUSTER)

	@echo "Done bundling and compressing CSS ...."

	@echo "Build finished successfully...."

print-vars:
	@echo $(BUILD_DIR)
	@echo $(BUILD_SUBDIR)

clean:
	@rm -rf $(BUILD_DIR)
	@echo "Removed build files ...."

.PHONY: all build print-vars
