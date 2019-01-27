/* eslint-env jasmine */

const { SpecReporter } = require('jasmine-spec-reporter')

exports.config = {
  specs: [
    './src/**/*.e2e-spec.js'
  ],
  baseUrl: 'http://localhost:3000/',
  jasmineNodeOpts: {
    print: () => { }
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }))
  },
  SELENIUM_PROMISE_MANAGER: false
}
