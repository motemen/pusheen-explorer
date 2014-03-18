exports.config = {
  baseUrl: 'http://localhost:8000',

  onPrepare: function () {
      var http = require('http'),
          ecstatic = require('ecstatic');
      http.createServer(
          ecstatic({ root: __dirname + '/../app' })
      ).listen(8000);
  },

  specs: ['spec.js'],

  jasmineNodeOpts: {
      isVerbose: true
  }
};
