var Q       = require('q'),
    request = require('request');

var API_KEY = process.env['TUMBLR_OAUTH_CONSUMER_KEY'];

scrape().then(function (posts) {
    console.log(JSON.stringify(posts));
});

function scrape () {
    return scrapeNext([], 0);
}

function scrapeNext (posts, offset, q) {
    if (!q) q = Q.defer();

    fetchNext(offset).then(function (data) {
        var receivedPosts = data.response.posts;
        if (receivedPosts.length > 0) {
            posts = posts.concat(receivedPosts);
            scrapeNext(posts, offset + receivedPosts.length, q);
        } else {
            q.resolve(posts);
        }
    });

    return q.promise;
}

function fetchNext (offset) {
    var qs = { api_key: API_KEY };
    if (offset) {
        qs['offset'] = offset;
    }

    var q = Q.defer();

    request(
        'http://api.tumblr.com/v2/blog/pusheen.com/posts',
        { qs: qs, json: true },
        function (error, response, body) {
            if (error) {
                q.reject(error);
            } else {
                q.resolve(body);
            }
        }
    );

    return q.promise;
}
