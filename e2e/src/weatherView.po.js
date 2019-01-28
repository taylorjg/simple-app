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
    const condition = async () => {
      const weatherInfos = await $$('.weather-info img')
      return weatherInfos.length > 0
    }
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
