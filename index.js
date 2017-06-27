var express = require('express')
var serveStatic = require('serve-static')
var multer  = require('multer')
var sharp  = require('sharp')
var b64 = require('base64-arraybuffer')
var progress = require('progress-stream')

var upload = multer().single('file')

var app = express()

app.use('/', serveStatic(__dirname + '/'));

var p = progress()

app.post('/upload_image', upload, function (req, res, next) {
  
  req.pipe(p)
  p.headers = req.headers;
  
  // p.on('progress', _)
  // upload(p, res, _)

  console.log(req.file);

  sharp(req.file.buffer)
    // .rotate(90)
    .resize(100)
    .jpeg({
      quality: 70
    })
    .toBuffer()
    .then(function (imageBuffer) {
      res.json({
        success: true,
        mime: 'image/jpeg',
        formats: {
          small: b64.encode(imageBuffer),
          medium: b64.encode(imageBuffer),
          large: b64.encode(imageBuffer)
        }
      });
    })
    .catch(function (err) {
      console.log(err)
    })

})

app.listen(9999);