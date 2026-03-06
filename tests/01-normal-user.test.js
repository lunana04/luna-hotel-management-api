import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";
import { token } from "./00-auth.test.js";

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let id;
export let anotherUserId;

describe("Users", () => {
  it("should reject missing token", async () => {
    const res = await chai.request(app).get("/api/v1/users");
    chai.expect(res.body.message).to.be.equal("No token provided");
  });

  it("should create a valid user", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe1@example.com",
        password: "password123",
        role: "ADMIN",
      });

    expect(res.body.message).to.be.equal("User successfully created");
    id = res.body.data.data[0].id;
  });

  it("should retrieve all users", async () => {
    const res = await chai
      .request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data).to.be.an("array");
  });

  it("should retrieve an user by ID", async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data.firstName).to.be.equal("John");
  });

  it("should reject non-string firstName", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: 123,
        lastName: "Parker",
        emailAddress: "peterpark@gmail.com",
        password: "spiderman",
        role: "NORMAL",
      });

    expect(res.body.message).to.be.equal("firstName should be a string");
  });

  it("should update a valid user", async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe7@example.com",
      });

    expect(res.body.message).to.be.equal(`User with the id: ${id} successfully updated`);
  });

  it("should reject non-string emailAddress during update", async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Wanda",
        lastName: "Maximoff",
        emailAddress: 123,
        password: "strongpassword123",
        role: "NORMAL",
      });

    expect(res.body.message).to.be.equal("emailAddress should be a string");
  });

  it("should sort users by lastName", async () => {
    const res = await chai.request(app)
      .get("/api/v1/users?sort=lastName")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data).to.be.an("array");
  });

  it("should paginate users", async () => {
    const res = await chai.request(app)
      .get("/api/v1/users?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data).to.be.an("array").with.length.at.most(2);
  });

  it("should delete an user by ID", async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.message).to.be.equal(`User with the id: ${id} successfully deleted`);
  });
});
