const BaseModel = require("./base");

//inheritance
class RoleModel extends BaseModel {
  constructor() {
    super("roles");
    this.select = {
        id: true,
        role: true,
    };
  }
}

module.exports = RoleModel;
