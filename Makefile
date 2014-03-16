app/data/entries.json: data/posts-raw.json
	cat data/posts-raw.json | jq '[ .[] | { post_url: .post_url, photo: .photos[] | .original_size } ]' > data/entries.json

data/posts-raw.json:
	node scripts/scrape-pictures.js > data/posts-raw.json
