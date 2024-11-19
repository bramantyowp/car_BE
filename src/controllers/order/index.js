const Joi = require("joi");
const express = require("express");

const BaseController = require("../base");
const OrderModel = require("../../models/order");
const CarsModel = require("../../models/cars");
const { authorize, checkRole } = require("../../middlewares/authorization");
const ValidationError = require("../../helpers/errors/validation");
const { createInvoice } = require("../../helpers/createInvoice");
const router = express.Router();

const order = new OrderModel();
const cars = new CarsModel();

const orderSchema = Joi.object({
  car_id: Joi.number().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().required(),
  is_driver: Joi.boolean().required(),
});

const PROMOS = [{
  title: "NEWUSER",
  discount: 25,
  expired_date: "25/11/2024"
},
{
  title: "SEWASUKASUKA",
  discount: 15,
  expired_date: "20/11/2024"
}]

class OrderController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", this.getAll);
    router.post("/", this.validation(orderSchema), authorize, this.create);
    router.get("/myorder", authorize, this.getMyOrder);
    router.get("/:id", this.get);
    router.get("/:id/invoice", authorize, this.downloadInvoice);
    router.put("/:id/payment", authorize, this.payment);
    // router.put("/:id", this.validation(carSchema), authorize, checkRole(['admin']), this.update);
    // router.delete("/:id", this.delete);
  }

  getMyOrder = async(req, res, next) => {
    try {
      const getOrder = await this.model.get({
        where: {
          user_id: req.user.id,
        }
      })
      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Order fetched successfully",
          data: getOrder,
        })
      );
    } catch (error) {
      return next(error);
    }
  }
  
  // mengubah create
  create = async (req, res, next) => {
    try {
      const getCars = await cars.getOne({
        where: {
          id: req.body.car_id,
          isAvailable: true,
        },
        select: {
          is_driver: true,
          price: true,
        },
      });

      if (!getCars)
        return next(new ValidationError("Car not found or is not available!"));

      if (getCars.is_driver && !req.body.is_driver){
        return next(new ValidationError("Mobil ini wajib menggunakan supir!"));
      }

      const startTime = new Date(req.body.start_time);
      const endTime = new Date(req.body.end_time);
      const total =
        getCars.price * ((endTime - startTime) / 1000 / 60 / 60 / 24);

      if (req.body.promo){
        if(!PROMOS.includes(req.body.promo))
          return next(new ValidationError("Promo not found or is not available!"));
        
        const selectedPromo = PROMOS.find(req.body.promo)
        total = price * ((100 - selectedPromo) / 100)
      }
        
      const [result, carUpdate] = await this.model.transaction([
        this.model.set({
          start_time: startTime,
          end_time: endTime,
          is_driver: req.body.is_driver,
          status: "pending",
          createdBy: req.user.fullname,
          updatedBy: req.user.fullname,
          total,
          cars: {
            connect: {
              id: req.body.car_id,
            },
          },
          users: {
            connect: {
              id: req.user.id,
            },
          },
        }),
        cars.update(req.body.car_id, { isAvailable: false }),
      ]);

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Order created successfully",
          data: result,
        })
      );
    } catch (error) {
      return next(error);
    }
  };

  updateOrder = async (req, res, next) => {
    try {
      const getCars = await cars.getOne({
        where: {
          id: req.body.car_id,
        },
        select: {
          is_driver: true,
          price: true,
        },
      });

      if (getCars.is_driver && !req.body.is_driver){
        return next(new ValidationError("Mobil ini wajib menggunakan supir!"));
      }

      const startTime = new Date(req.body.start_time);
      const endTime = new Date(req.body.end_time);
      const total =
        getCars.price * ((endTime - startTime) / 1000 / 60 / 60 / 24);

      if (req.body.promo){
        if(!PROMOS.includes(req.body.promo))
          return next(new ValidationError("Promo not found or is not available!"));
        
        const selectedPromo = PROMOS.find(req.body.promo)
        total = price * ((100 - selectedPromo) / 100)
      }

      this.model.update({
        start_time: startTime,
        end_time: endTime,
        is_driver: req.body.is_driver,
        status: "pending",
        updatedBy: req.user.fullname,
        total,
      })

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Order updated successfully",
          data: result,
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  payment = async (req, res, next) => {
    const { id } = req.params;
    try {
      const { receipt } = req.body;

      const getLastOrderToday = await this.model.count({
        where: {
          createdDt: {
            lte: new Date(),
          },
        }
      });
      
      const currentDate = new Date();
      const invNumber = `INV/${currentDate.getFullYear()}/${currentDate.getMonth() + 1
        }/${currentDate.getDate()}/${getLastOrderToday}`;

      const orderPaid = await this.model.update(id, {
        order_no: invNumber,
        receipt,
        status: "paid",
      });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Order Paid successfully",
          data: orderPaid,
        })
      );
    } catch (error) {
      return next(error);
    }
  };

  orderCanceled = async (req, res, next) => {
    try {
      const order = await this.model.getById(req.params.id)

      if (!order)
        return next(new ValidationError("Order not found or is not available!"));

      const getCars = await cars.getById(order.car_id);

      if (!getCars)
        return next(new ValidationError("Car not found or is not available!"));

      await cars.update(order.car_id, {
        isAvailable: true,
      });

      const orderCanceled = await this.model.update(order.id, {
        status: "cancelled",
      });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Order canceled successfully",
          data: orderCanceled,
        })
      );

    } catch (error) {
      return next(error);
    }
  }

  downloadInvoice = async (req, res, next) => {
    const { id } = req.params;
    try {
      const order = await this.model.getById(id, {
        select: {
          order_no: true,
          createdDt: true,
          status: true,
          user_id: true,
          start_time: true,
          end_time: true,
          total: true,
          cars: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          users: {
            select: {
              id: true,
              fullname: true,
              address: true
            }
          }
        }
      });

      if (order.status !== "paid") {
        return next(new ValidationError("Order not paid!"));
      }

      createInvoice(order, res);
    } catch (error) {
      return next(error);
    }
  };
}

new OrderController(order);

module.exports = router;
