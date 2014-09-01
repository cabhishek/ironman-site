export PATH  := node_modules/.bin:$(PATH)

# Root path to asset files
assets_dir := www/assets

# Root path for assets_dir files after build
build_dir := www/build
build_sub_dir := $(build_dir)/css $(build_dir)/css/vendor

# Main Datathletics CSS file
site_css := /css/style.css


# Vendor files
vendor_css := /css/vendor/bootstrap.css

TIMSTAMP := $$(date +'%Y%m%d%H%M%S')

cache_buster := $(subst %,$(TIMSTAMP),?v=%)

all:build

build:

	@echo ">>> Build started ...."
	@echo ">>> NODE_ENV =>" $(NODE_ENV)

	@rm -rf $(build_dir) && mkdir $(build_dir) && mkdir $(build_sub_dir)
	@echo ">>> Removed old CSS folder ...."

	@cp -r $(assets_dir)/images $(build_dir)/images
	@echo ">>> Copied images ...."

	@cp -r $(assets_dir)/js $(build_dir)/js
	@echo ">>> Copied JS files"

	@myth -c $(assets_dir)/$(site_css) > $(build_dir)$(site_css)
	@myth -c $(assets_dir)/$(vendor_css) > $(build_dir)$(vendor_css)
	@echo ">>> Done bundling and compressing CSS ...."

	@echo ">>> Build finished successfully...."

print-vars:
	@echo $(build_dir)
	@echo $(build_sub_dir)

clean:
	@rm -rf $(build_dir)
	@echo ">>> Removed build files ...."

.PHONY: all build print-vars
