describe('pusheen explorer', function () {
    var entries;

    beforeEach(function () {
        browser.get('/');
    });

    it('should list 50 entries at first', function () {
        var entries = element.all(by.repeater('entry in entries'));
        expect(entries.count()).toEqual(50);
    });

    it('should filter by query input', function () {
        element(by.model('query')).sendKeys('success');

        var imageURLs = element.all(by.repeater('entry in entries')).map(function (el) {
            return el.findElement(by.css('img')).getAttribute('src');
        });

        expect(imageURLs).toContain('http://25.media.tumblr.com/tumblr_ma3rbnZTE11qhy6c9o7_400.gif');
    });
});

