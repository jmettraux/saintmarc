
N:=saintmarc
LICENSE:=https://github.com/jmettraux/$(N)/LICENSE.txt
VERSION:=$(shell grep VERSION src/$(N).js | ruby -e "puts gets.match(/VERSION = '([\d\.]+)/)[1]")
NV:=$(N)-$(VERSION)

#SHA:=$(shell git log -1 --format="%H")
SHA:=$(shell git log -1 --format="%h")
NOW:=$(shell date)


v:
	@echo $(VERSION)

spec:
	bundle exec rspec

pkg_plain:
	mkdir -p pkg
	cp src/$(N).js pkg/$(NV).js
	echo "/* from commit $(SHA) on $(NOW) */" >> pkg/$(NV).js
	cp pkg/$(NV).js pkg/$(NV)-$(SHA).js

pkg_mini:
	mkdir -p pkg
	printf "/* $(NV).min.js | MIT license: $(LICENSE) */" > pkg/$(NV).min.js
	java -jar tools/closure-compiler.jar --js src/$(N).js >> pkg/$(NV).min.js
	echo "/* minified from commit $(SHA) on $(NOW) */" >> pkg/$(NV).min.js
	cp pkg/$(NV).min.js pkg/$(NV)-$(SHA).min.js

pkg_comp:
	mkdir -p pkg
	printf "/* $(NV).com.js | MIT license: $(LICENSE) */\n" > pkg/$(NV).com.js
	cat src/$(N).js | ruby tools/compactor.rb >> pkg/$(NV).com.js
	echo "\n/* compacted from commit $(SHA) on $(NOW) */" >> pkg/$(NV).com.js
	cp pkg/$(NV).com.js pkg/$(NV)-$(SHA).com.js

#pkg: pkg_plain pkg_mini pkg_comp
pkg: pkg_plain pkg_comp
  # pkg_mini cleans away the parser ;-(

clean-sha:
	find pkg -name "$(N)-*-*js" | xargs rm
clean:
	rm -fR pkg/


.PHONY: spec pkg clean-sha clean

