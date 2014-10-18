test:
	npm install
	$(shell npm bin)/webdriver-manager update
	$(shell npm bin)/protractor test/protractor.conf.js

app/data/entries.json:
	bundle exec ruby scripts/json.rb > app/data/entries.json

app/data/entries.yaml: fetch-entries
	cat cache/posts-raw.json | bundle exec ruby scripts/ocr.rb

fetch-entries:
	mkdir -p cache
	bundle exec ruby scripts/fetch-entries.rb > cache/posts-raw.json.tmp
	mv cache/posts-raw.json.tmp cache/posts-raw.json

clean:
	rm -f app/data/entries.json cache/posts-raw.json

.PHONY: test fetch-entries
