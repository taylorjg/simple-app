const { browser } = require('protractor')
const { WeatherViewPage } = require('./weatherView.po')
const { version } = require('../../package.json')

describe('WeatherView', () => {

  let page

  beforeAll(() => {
    browser.waitForAngularEnabled(false)
  })

  beforeEach(() => {
    page = new WeatherViewPage()
  })

  describe('version', () => {
    it('should display the correct version number', async () => {
      await page.get()
      expect(await page.getVersion()).toMatch(new RegExp(`${version}$`))
    })
  })

  describe('default weatherInfos', () => {
    it('should display the correct locations', async () => {
      await page.get()
      await browser.sleep(2000)
      const locations = await page.getWeatherInfoLocations()
      expect(locations[0]).toBe('Weather in Manchester, GB')
      expect(locations[1]).toBe('Weather in Edinburgh, GB')
      expect(locations[2]).toBe('Weather in London, GB')
      expect(locations[3]).toBe('Weather in Sydney, AU')
    })
  })
})
