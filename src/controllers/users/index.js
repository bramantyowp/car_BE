const Joi = require("joi");

const BaseController = require("../base");
const UserModel = require("../../models/user");
const express = require("express");
const ValidationError = require("../../helpers/errors/validation");
const { encryptPassword } = require("../../helpers/bcrypt");
const { authorize, checkRole } = require('../../middlewares/authorization')
const router = express.Router();

const user = new UserModel();

const userCreateSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6),
  roleId: Joi.number().required(),
  address: Joi.string().required(),
  avatar: Joi.string().uri().allow(null),
  gender: Joi.string(),
  phone_number: Joi.string(),
  driver_license: Joi.string().uri().allow(null),
  birthdate: Joi.date(),
});

const userUpdateSchema = Joi.object({
  fullname: Joi.string().required(),
  role: Joi.string().allow(null),
  address: Joi.string().required(),
  roleId: Joi.number().required(),
  avatar: Joi.string().uri().allow(null),
  gender: Joi.string(),
  driver_license: Joi.string().uri().allow(null),
  birthdate: Joi.date(),
});

class UserController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", this.getAll);
    router.post("/", this.validation(userCreateSchema), authorize, checkRole(['admin']), this.checkUnique, this.encrypt,  this.create);
    router.get("/:id", this.get);
    router.put("/:id", this.validation(userUpdateSchema), authorize, checkRole(['admin']), this.update);
    router.delete("/:id", this.delete);
  }

  checkUnique = async (req, res, next) => {
    const checkUnique = await this.model.getOne({
      where: {
        OR: [
          {
            email: req.body.email,
          },
          {
            phone_number: req.body.phone_number,
          },
        ],
      },
      select: {
        email: true,
        phone_number: true
      }
    });
    
    if (checkUnique)
      return next(new ValidationError("email or phone number already exist"));

    next()
  };
  
  encrypt = async (req, res, next) => {
    const encryptedPass = await encryptPassword(req.body.password);
    req.body.password = encryptedPass;
    next()
  }
}

new UserController(user);

module.exports = router;
