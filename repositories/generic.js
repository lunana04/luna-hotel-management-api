import prisma from '../prisma/client.js';

class GenericRepository {
  constructor(model, primaryKey = 'id') {
    this.model = model;
    this.primaryKey = primaryKey;
  }

  async create(data) {
    return await prisma[this.model].create({ data });
  }

  async findAll(req, filters = {}, sortBy, sortOrder = 'asc') {
    const amount = Number(req.query.amount || 10);
    const page = Number(req.query.page || 1);

    sortBy = sortBy || req.query.sortBy || this.primaryKey;

    const query = {
      take: amount,
      skip: (page - 1) * amount,
      orderBy: {
        [sortBy]: sortOrder,
      },
    };

    if (Object.keys(filters).length > 0) {
      query.where = {};
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          if (key === this.primaryKey) {
            query.where[key] = String(value);
          } else if (typeof value === 'object' && (value.equals || value.in)) {
            query.where[key] = value;
          } else {
            query.where[key] = { contains: String(value) };
          }
        }
      }
    }

    const data = await prisma[this.model].findMany(query);
    const totalResources = await prisma[this.model].count({
      where: query.where,
    });

    const totalPages = Math.ceil(totalResources / amount);
    const nextPage =
      page < totalPages
        ? `http://localhost:3000/api/v1/${this.model}s?page=${page + 1}`
        : null;
    const previousPage =
      page > 1
        ? `http://localhost:3000/api/v1/${this.model}s?page=${page - 1}`
        : null;

    return {
      data,
      amount: totalResources,
      nextPage,
      previousPage,
    };
  }


  async findById(id) {
    return await prisma[this.model].findUnique({
      where: { [this.primaryKey]: id },
    });
  }

  async update(id, data) {
    return await prisma[this.model].update({
      where: { [this.primaryKey]: id },
      data,
    });
  }

  async delete(id) {
    return await prisma[this.model].delete({
      where: { [this.primaryKey]: id },
    });
  }

  async findByField(field, value) {
    return await prisma[this.model].findFirst({
      where: { [field]: value },
    });
  }

  async findUnique(filters) {
    const where = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        if (key === this.primaryKey) {
          where[key] = String(value);
        } else {
          where[key] = { contains: String(value) };
        }
      }
    }

    return await prisma[this.model].findUnique({ where });
  }
}

export default GenericRepository;
