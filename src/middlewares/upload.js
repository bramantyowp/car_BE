const multer = require('multer')
const path = require('path')

const publicDir = path.join(__dirname, '../../public')
const uploadsDir = path.join(publicDir, 'uploads')

const memoryStorage = multer.memoryStorage()
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    console.log(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  }
})

module.exports = {
  memory: multer({ storage: memoryStorage }),
  disk: multer({ storage: diskStorage })
}
