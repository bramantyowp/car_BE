const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

// abstract class
class BaseModel {
  //encapsulation
  constructor(model) {
    this.name = model
    this.model = prisma[model]; //prisma.users
  }

  get = async ({ where = {}, q = {}, select = this.select }) => {
    const { sortBy = "createdDt", sort = "desc", page = 1, limit = 10 } = q;
    const query = {
      select,
      where,
      orderBy: {
        [sortBy]: sort,
      },
      skip: (page - 1) * limit,
      take: limit,
    };
    
    const [resources, count] = await prisma.$transaction([
      this.model.findMany(query),
      this.model.count({where})
    ]);

    return {
      resources,
      count,
    };
  };

  getById = async (id, option) => {
    return this.model.findUnique({ where: { id: Number(id) }, ...option });
  };

  getOne = async (query) => {
    return this.model.findFirst(query);
  };

  set = (data) => {
    return this.model.create({ data });
  };

  setMany = (data) => {
    return this.model.createMany({ data });
  }

  update = (id, data) => {
    return this.model.update({
      where: { id: Number(id) },
      data,
    });
  };

  delete = async (id) => {
    return this.model.delete({
      where: { id: Number(id) },
    });
  };

  count = async (where) => {
    return this.model.count(where);
  };

  transaction = async(query) => {
    return prisma.$transaction(query)
  }
}

module.exports = BaseModel;
