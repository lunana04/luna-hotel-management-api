import bcryptjs from "bcryptjs";
import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { describe, it, before } from "mocha";

import app from "../app.js";
import prisma from "../prisma/client.js";

const chai = chaiModule.use(chaiHttp);

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt();
  return bcryptjs.hash(password, salt);
};

export let token;

describe("Auth", () => {
  before(async () => {
    // Clear existing user to avoid duplicates
    await prisma.user.deleteMany({ where: { emailAddress: "john.doe@example.com" } });

    await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe@example.com",
        password: await hashPassword("password123"),
        role: "ADMIN",
      },
    });
  });

  it("should login an admin user and return a token", async () => {
    const res = await chai.request(app).post("/api/v1/auth/login").send({
      emailAddress: "john.doe@example.com",
      password: "password123",
    });

    chai.expect(res).to.have.status(200);
    chai.expect(res.body.token).to.exist;

    token = res.body.token;
  });
});
