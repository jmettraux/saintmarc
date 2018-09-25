
VERSION:=$(shell grep VERSION src/saintmarc.js | ruby -e "puts gets.match(/VERSION = '([\d\.]+)/)[1]")

#SHA:=$(shell git log -1 --format="%H")
SHA:=$(shell git log -1 --format="%h")
NOW:=$(shell date)


v:
	@echo $(VERSION)

spec:
	bundle exec rspec

pkg_plain:
	mkdir -p pkg
	cp src/saintmarc.js pkg/saintmarc-$(VERSION).js
	echo "/* from commit $(SHA) on $(NOW) */" >> pkg/saintmarc-$(VERSION).js
	cp pkg/saintmarc-$(VERSION).js pkg/saintmarc-$(VERSION)-$(SHA).js

pkg_mini:
	mkdir -p pkg
	printf "/* saintmarc-$(VERSION).min.js | MIT license: http://github.com/jmettraux/saintmarc.js/LICENSE.txt */" > pkg/saintmarc-$(VERSION).min.js
	java -jar tools/closure-compiler.jar --js src/saintmarc.js >> pkg/saintmarc-$(VERSION).min.js
	echo "/* minified from commit $(SHA) on $(NOW) */" >> pkg/saintmarc-$(VERSION).min.js
	cp pkg/saintmarc-$(VERSION).min.js pkg/saintmarc-$(VERSION)-$(SHA).min.js

pkg_comp:
	mkdir -p pkg
	printf "/* saintmarc-$(VERSION).com.js | MIT license: http://github.com/jmettraux/saintmarc.js/LICENSE.txt */\n" > pkg/saintmarc-$(VERSION).com.js
	cat src/saintmarc.js | ruby tools/compactor.rb >> pkg/saintmarc-$(VERSION).com.js
	echo "/* compacted from commit $(SHA) on $(NOW) */" >> pkg/saintmarc-$(VERSION).com.js
	cp pkg/saintmarc-$(VERSION).com.js pkg/saintmarc-$(VERSION)-$(SHA).com.js

pkg: pkg_plain pkg_mini pkg_comp
#pkg: pkg_plain pkg_comp

clean-sha:
	find pkg -name "saintmarc-*-*js" | xargs rm
clean:
	rm -fR pkg/


.PHONY: spec pkg clean-sha clean

