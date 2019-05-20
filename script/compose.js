const fs = require('fs')

const screenshoter = require('../')

async function run() {

  if (process.argv[2] === undefined) {
    throw new Error('No url specified')
  }

  const images = await screenshoter.download(process.argv[2])
  const image = await screenshoter.composeAll(images)
  
  // usage with files

  // const image = await screenshoter.composeAll({
  //   imageDesktop: fs.readFileSync(__dirname + '/../test/fixtures/desktop.jpg'),
  //   imageTablet: fs.readFileSync(__dirname + '/../test/fixtures/tablet.jpg'),
  //   imageSmartphone: fs.readFileSync(__dirname + '/../test/fixtures/smartphone.jpg'),
  // })

  await image.write('output/composed.png')
}

run()
