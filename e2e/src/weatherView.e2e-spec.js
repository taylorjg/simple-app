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
})
