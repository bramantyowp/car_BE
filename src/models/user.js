const BaseModel = require("./base");

//inheritance
class UserModel extends BaseModel {
  constructor() {
    super("users");
    this.select = {
        id: true,
        fullname: true,
        email: true,
        role: true,
        phone_number: true,
        address: true,
    };
  }
}

module.exports = UserModel;
