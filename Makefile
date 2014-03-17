app/data/entries.json: cache/posts-raw.json
	cat cache/posts-raw.json | jq '[ .[] | { post_url: .post_url, photo: .photos[] | .original_size } ]' > app/data/entries.json

cache/posts-raw.json:
	mkdir -p cache
	node scripts/scrape-pictures.js > cache/posts-raw.json

clean:
	rm -f app/data/entries.json cache/posts-raw.json
