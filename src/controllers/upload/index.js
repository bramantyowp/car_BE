const BaseController = require("../base");
const express = require("express");
const { disk, memory } = require("../../middlewares/upload");
const { uploader } = require("../../helpers/cloudinary");
const router = express.Router();

class UploadController extends BaseController {
  constructor(){
    super();
    router.post("/", memory.single('file'), this.upload);
    router.post("/local", disk.single('file'), this.uploadDisk);
  }

  upload = async(req, res, next) => {
    try{
      const { file } = req;
      // mengambil file dari url buffer, karena file bisa di convert 
      // ke sebuah url dengan tipe base64
      const allowedFile = [
        'image/png', //png
        'image/jpeg', //jpeg, jpg
        'image/svg+xml', //svg
        'application/pdf', //pdf
        'application/vnd.ms-excel', //xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' //xlsx
      ]

      if(allowedFile.includes(file.mimetype) === false) {
        return next(new ValidationError("File not allowed"))
      }

      const fileBase64 = file.buffer.toString("base64");
      const fileDataUri = `data:${file.mimetype};base64,${fileBase64}`;
      
      const fileUpload = await uploader.upload(fileDataUri, {
        resource_type: "auto",
      });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Uploaded Succesfully",
          data: {
            url: fileUpload.secure_url,
            width: fileUpload.width,
            height: fileUpload.height,
            format: fileUpload.format,
            resource_type: fileUpload.resource_type
          }
        })
      );
    } catch(e) {
      next(e)
    }
  } 

  uploadDisk = async(req, res, next) => {
    try{
      const { file } = req;
      const allowedFile = [
        'image/png', //png
        'image/jpeg', //jpeg, jpg
        'image/svg+xml', //svg
        'application/pdf', //pdf
        'application/vnd.ms-excel', //xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' //xlsx
      ]

      if(allowedFile.includes(file.mimetype) === false) {
        return next(new ValidationError("File not allowed"))
      }

      const proxyHost = req.headers["x-forwarded-host"] || req.headers["host"];

      res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Uploaded Succesfully",
          data: {
            url: `http://${proxyHost}/public/uploads/${file.filename}`
          }
        })
      )
    } catch(e){
      next(e)
    }
  }

}

new UploadController()

module.exports = router
