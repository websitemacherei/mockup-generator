const app = require('express')()
const screenshoter = require('./')

async function downloadAnCompose(url) {

  const images = await screenshoter.download(url)
  const image = await screenshoter.composeAll(images)
  return image
}

app.get('/', (req, res) => {
  
  downloadAnCompose(req.query.url)
  
  // assemble image
  .then(image => {
    
    image.getBufferAsync('image/png')
    
    .then(buf => {
      
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buf.length
      });
      
      res.end(buf); 
    })
  })

  // error while assembling
  .catch(err => {
    res.status(500).send(err.message)
  }) 

})

app.listen(3000)