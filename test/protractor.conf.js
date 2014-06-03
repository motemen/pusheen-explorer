var testPort = process.env.TEST_PORT || 9870;

exports.config = {
  baseUrl: 'http://localhost:' + testPort,

  capabilities: {
      browserName: 'firefox'
  },

  onPrepare: function () {
      var http = require('http'),
          ecstatic = require('ecstatic');
      http.createServer(
          ecstatic({ root: __dirname + '/../app' })
      ).listen(testPort);
  },

  specs: ['spec.js'],

  jasmineNodeOpts: {
      isVerbose: true
  }
};
