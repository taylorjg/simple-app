/* eslint-env jasmine */

const { SpecReporter } = require('jasmine-spec-reporter')

exports.config = {
  specs: [
    './src/**/*.e2e-spec.js'
  ],
  baseUrl: 'http://localhost:3000/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: () => { }
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }))
  }
}
