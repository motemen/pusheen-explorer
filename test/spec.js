describe('/', function () {
    var entries;

    beforeEach(function () {
        browser.get('/');
    });

    it('should list 30 entries at first', function () {
        var entries = element.all(by.repeater('entry in entries'));
        expect(entries.count()).toEqual(30);
    });

    describe('with query input', function () {
        beforeEach(function () {
            element(by.model('query')).sendKeys('success');
        });

        it('should filter by query input', function () {
            var imageFilenames = element.all(by.repeater('entry in entries')).map(function (el) {
                return el.findElement(by.css('img')).getAttribute('src').then(function (src) {
                    return src.replace(/.*\//, '');
                });
            });

            expect(imageFilenames).toContain('tumblr_ma3rbnZTE11qhy6c9o7_400.gif');
        });

        it('should have query string in the location', function () {
            expect(browser.getCurrentUrl()).toMatch(/\?q=success$/);
        });
    });
});

describe('/?q={query}', function () {
    beforeEach(function () {
        browser.get('/?q=reality');
    });

    it('should use ?q as the input query', function () {
        expect(element(by.model('query')).getAttribute('value')).toEqual('reality');
    });

})
