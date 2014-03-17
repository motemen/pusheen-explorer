var fs     = require('fs'),
    nodecr = require('nodecr'),
    Q      = require('q'),
    _      = require('lodash'),
    spawn  = require('child_process').spawn;

nodecr.log = function () {};

Q.nfcall(fs.readFile, 'cache/posts-raw.json').then(function (json) {
    const MINIMUM_WIDTH = 300;

    var posts = JSON.parse(json);
    var postAndPhotos = _(posts).map(function (post) {
        return _.map(post.photos || [], function (photo) {
            return [ post.post_url, photo.original_size, photo.alt_sizes ]
        });
    }).flatten(true).map(function (tuple) {
        var suitablePhoto = _(tuple[2]).sortBy('width').find(function (p) {
            return p.width >= MINIMUM_WIDTH;
        });
        return [ tuple[0], tuple[1], suitablePhoto && suitablePhoto.url ];
    }).filter(function (tuple) {
        return tuple[2];
    }).value();

    function downloadImage (url) {
        var filePath = url.replace(/^http:\/\//, 'cache/');

        if (fs.existsSync(filePath)) {
            console.log('  exists ' + filePath);
            return Q(filePath);
        }

        console.log('download ' + url + ' -> ' + filePath);

        var q = Q.defer();
        spawn('wget', [ '-nv', '--mirror', '-P', 'cache', url ], { stdio: 'inherit' })
            .on('close', function () { q.resolve(filePath) });
        return q;
    }

    function extractText (filePath) {
        console.log('extractText', filePath);

        return Q.ninvoke(nodecr, 'process', filePath).then(function (text) {
            return text.replace(/^\s+|\s+$/g, '');
        }).then(function (text) {
            console.log('   text ' + JSON.stringify(text));
            return text;
        }, function (e) {
            console.log(e);
        });
    }

    var result = [];

    new function loop () {
        var postAndPhoto = postAndPhotos.shift();
        if (!postAndPhoto) {
            console.log(JSON.stringify(result, null, 4));
            return;
        }

        var postUrl      = postAndPhoto[0],
            originalSize = postAndPhoto[1],
            photoUrl     = postAndPhoto[2];
        Q(photoUrl)
            .then(downloadImage)
            .then(extractText)
            .then(function (text) {
                console.log(text);
                result.push({
                    text: text,
                    postUrl: postUrl,
                    photo: originalSize,
                });
            })
            .then(loop);
    }
})
