const { browser, by, element } = require('protractor')

class WeatherViewPage {

  async get() {
    await browser.get('/index.html')
  }

  getVersion() {
    return element(by.css('.version')).getText()
  }
}

module.exports = {
  WeatherViewPage
}
