const BaseModel = require("./base");

//inheritance
class AccessModel extends BaseModel {
  constructor() {
    super("access");
    this.select = {
        id: true,
        visible: true,
        role_id: true,
        menu_id: true,
        grant: true,
    };
  }
}

module.exports = AccessModel;
