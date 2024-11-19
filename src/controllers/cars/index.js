const Joi = require("joi");

const BaseController = require('../base')
const CarModel = require('../../models/cars')
const express = require('express');
const { authorize, checkRole } = require("../../middlewares/authorization");
const { memory } = require('../../middlewares/upload');
const rbac = require('../../middlewares/rbac');
var router = express.Router()

const cars = new CarModel();

const carSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  type: Joi.string(),
  manufactur: Joi.string().required(),
  isDriver: Joi.boolean().required(),
  img: Joi.string().uri().allow(null),
  description: Joi.string().allow(null),
  isAvailable: Joi.boolean(),
  licenseNumber: Joi.string(),
  seat: Joi.number().min(2),
  baggage: Joi.number(),
  transmission: Joi.string(),
  year: Joi.string(),
})

class CarsController extends BaseController {
  constructor(model) {
    super(model);
    this.searchField = ['name', 'type', 'manufactur', 'year']
    router.get("/", this.handleFilter, this.getAll);
    router.post("/", this.validation(carSchema), authorize, rbac('CARS', 'create'), this.create);
    router.get("/export", this.export('cars export'));
    router.post("/import", memory.single('file'), this.import);
    router.get("/:id", this.get);
    router.put("/:id", this.validation(carSchema), authorize, rbac('CARS', 'update'), this.update);
    router.delete("/:id", this.delete);
  }

  // method ini digunakan untuk menghandle filter pencarian berdasarkan field
  // yang di definisikan di dalam array searchField
  // misalnya kita ingin mencari mobil berdasarkan nama, type, dan tahun
  // maka kita dapat mengirimkan parameter query seperti ini
  // ?search=avanza&type=sedan&yearMin=2015
  // maka filter akan menghasilkan array seperti ini
  // [{type: 'sedan'}, {year: {gte: 2015}}]
  // dan di gabung dengan search akan menghasilkan object seperti ini
  //  where: {
  //     OR: [ // search menggunakan OR
  //       name: {
  //         contains: 'sedan', 
  //         mode: 'insensitive'
  //       }
  //     ],
  //     AND: [{ // filter menggunakan AND
  //       year: {
  //         gte: 2015
  //       }
  //     }]
  //  }
  // yang akan digunakan sebagai parameter where di dalam prisma client
  handleFilter = (req, res, next) => {
    let filter = []
    console.log(req.query)
    if(req.query.manufactur){
      filter.push({ manufactur: req.query.manufactur })
    }
    if(req.query.type){
      filter.push({ type: req.query.type })
    }
    if(req.query.yearMin){
      filter.push({ year: {gte: req.query.yearMin} })
    }
    if(req.query.yearMax){
      filter.push({ year: {lte: req.query.yearMin} })
    }
    if(req.query.priceMin){
      filter.push({ price: {gte: req.query.priceMin} })
    }
    if(req.query.priceMax){
      filter.push({ price: {lte: req.query.priceMax} })
    }

    if(filter.length) this.filter = filter
    
    next()
  }
}

new CarsController(cars);

module.exports = router
