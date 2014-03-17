app/data/entries.json: cache/posts-raw.json
	node scripts/ocr-pictures.js > app/data/entries.json

cache/posts-raw.json:
	mkdir -p cache
	node scripts/scrape-pictures.js > cache/posts-raw.json

clean:
	rm -f app/data/entries.json cache/posts-raw.json
