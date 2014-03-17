var fs     = require('fs'),
    nodecr = require('nodecr'),
    Q      = require('q'),
    _      = require('lodash'),
    spawn  = require('child_process').spawn;

Q.nfcall(fs.readFile, 'cache/posts-raw.json').then(function (json) {
    const SUITABLE_WIDTH = 300;

    var posts = JSON.parse(json);
    var photoURLs = _(posts).map(function (post) {
        return post.photos || [];
    }).flatten().map(function (photo) {
        var photo = _(photo.alt_sizes).sortBy('width').find(function (p) {
            return p.width >= SUITABLE_WIDTH;
        });

        return photo && photo.url;
    }).compact().value();

    new function downloadNext () {
        var url = photoURLs.shift();
        if (!url) return;

        console.log(' ---> ' + url)

        var wget = spawn('wget', [ '-nv', '--mirror', '-P', 'cache', url ], { stdio: 'inherit' });
        wget.on('close', function () {
            var path = url.replace(/^http:\/\//, 'cache/');
            nodecr.process(path, function (err, text) {
                if (err) {
                    console.log('      error: ' + err)
                } else if (text) {
                    text = text.replace(/^\s+|\s+$/g, '');
                    console.log('      text: ' + JSON.stringify(text));
                }
                downloadNext();
            }, 'eng');
        })
    }
})
