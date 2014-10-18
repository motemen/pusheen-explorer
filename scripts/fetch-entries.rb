require 'faraday'
require 'faraday_middleware'
require 'json'

API_KEY = ENV.fetch 'TUMBLR_OAUTH_CONSUMER_KEY'

conn = Faraday.new(url: 'http://api.tumblr.com') do |conn|
  conn.request  :url_encoded
  conn.response :json
  conn.adapter  Faraday.default_adapter
end

offset = 0
all_posts = []

loop do
  STDERR.puts "---> Fetching entries #{offset+1}-#{offset+20}"
  resp = conn.get '/v2/blog/pusheen.com/posts', json: true, api_key: API_KEY, offset: offset
  posts = resp.body['response']['posts']
  break if posts.empty?

  all_posts += posts
  offset += posts.length
end

puts JSON.dump(all_posts)
