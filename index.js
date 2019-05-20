const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const jimp = require('jimp')

const iPhone = devices['iPhone 6']
const iPad = devices['iPad']

const DESKTOP_RATIO = 1.600
const TABLET_RATIO = 1.333
const SMARTPHONE_RATIO = 1.775

const download = module.exports.download = async url => {

  let browser = await puppeteer.launch({ headless: true })
  let page = await browser.newPage()

  // desktop
  await page.setViewport({ width: 1050 * DESKTOP_RATIO, height: 1050 })
  await page.goto(url)
  const imageDesktop = await page.screenshot({ type: 'jpeg', encoding: 'binary' })

  // tablet
  await page.setViewport({ width: 1000, height: Math.round(1000 * TABLET_RATIO) })
  await page.emulate(iPad)
  await page.goto(url)
  const imageTablet = await page.screenshot({ type: 'jpeg', encoding: 'binary' })

  // smartphone
  await page.setViewport({ width: 700, height: Math.round(700 * SMARTPHONE_RATIO) })
  await page.emulate(iPhone)
  await page.goto(url)
  const imageSmartphone = await page.screenshot({ type: 'jpeg', encoding: 'binary' })

  // tv
  await page.close()
  await browser.close()

  return { imageDesktop, imageTablet, imageSmartphone }
}

const composeDesktop = module.exports.composeDesktop = async image => {
  
  let desktop_bg = await jimp.read(__dirname + '/mocks/desktop.png')

  let desktop_fg = await jimp.read(image)
  
  desktop_fg.resize(870, jimp.AUTO)

  return await desktop_bg.blit(desktop_fg, 130, 37, 0, 0, 870, 540)
}

const composeTablet = module.exports.composeTablet = async image => {
  
  let tablet_bg = await jimp.read(__dirname + '/mocks/tablet.png')
  
  tablet_bg.resize(370, 522)
  
  let tablet_fg = await jimp.read(image)
  
  tablet_fg.resize(320, 320 * TABLET_RATIO)

  return  await tablet_bg.blit(tablet_fg, 25, 48, 0, 0, 320, 320 * TABLET_RATIO)
}

const composeSmartphone = module.exports.composeSmartphone = async image => {
  
  let smartphone_bg = await jimp.read(__dirname + '/mocks/smartphone.png')
  
  smartphone_bg.resize(157, 332)

  let smartphone_fg = await jimp.read(image)
  
  smartphone_fg.resize(133, 133 * SMARTPHONE_RATIO)

  return await smartphone_bg.blit(smartphone_fg, 12, 49, 0, 0, 133, 133 * SMARTPHONE_RATIO) 
}

module.exports.composeAll = async ({ imageDesktop, imageTablet, imageSmartphone }) => {

  const desktop = await composeDesktop(imageDesktop)
  const tablet = await composeTablet(imageTablet) 
  const smartphone = await composeSmartphone(imageSmartphone)

  let image = await desktop.blit(tablet, 725, 130, 0, 0, 370, 522)
  image = await image.blit(smartphone, 650, 320, 0, 0, 157, 332)

  return image
}
