const { browser, $, $$ } = require('protractor')

class WeatherViewPage {

  async get() {
    await browser.get('/index.html')
  }

  getVersion() {
    return $('.version').getText()
  }

  getWeatherInfos() {
    return $$('.weather-info')
  }

  waitForWeatherInfoToLoad(timeout) {
    const EC = browser.ExpectedConditions
    const condition = EC.visibilityOf($$('.weather-info img').first())
    return browser.wait(condition, timeout)
  }

  async getWeatherInfoLocations() {
    const weatherInfos = await this.getWeatherInfos()
    return Promise.all(
      weatherInfos
        .map(weatherInfo => weatherInfo.$('.weather-info__location'))
        .map(location => location.getText())
    )
  }
}

module.exports = {
  WeatherViewPage
}
