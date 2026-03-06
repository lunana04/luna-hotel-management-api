import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import app from '../app.js';

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let token;
export let guestId;
export let anotherGuestId;

describe('Guest', () => {
  it('should reject missing token', async () => {
    const res = await chai.request(app).get('/api/v1/guests');

    chai.expect(res.body.message).to.be.equal('No token provided');
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

  it("should login an admin user and return a token", async () => {
    const res = await chai.request(app).post("/api/v1/auth/login").send({
      emailAddress: "john.doe@example.com",
      password: "password123",
    });

    chai.expect(res).to.have.status(200);
    chai.expect(res.body.token).to.exist;

    token = res.body.token;
  });

  it('should create a valid guest', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Harry',
        lastName: 'Potter',
        emailAddress: 'harryp@example.com',
        phoneNumber: '+1234567890',
      });
    expect(res.body.message).to.be.equal('Guest successfully created');
    guestId = res.body.data.data[0].guestId;
  });

  it('should reject wrong format phoneNumber', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Harry',
        lastName: 'Potter',
        emailAddress: 'harryp@example.com',
        phoneNumber: '1234567890',
      });
    chai.expect(res.body.message).to.be.equal('phoneNumber format is invalid');
  });

  it('should retrieve all guests', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data).to.be.an('array');
  });

  it('should retrieve an guest by ID', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/guests/${guestId}`)
      .set('Authorization', `Bearer ${token}`);
    chai.expect(res.body.data.firstName).to.be.equal('Harry');
  });

  it('should filter guests by last name', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/guests?lastName=Potter')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].lastName).to.be.equal('Potter');
  });

  it('should sort guests by last name', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/guests?sortBy=lastName')
      .set('Authorization', `Bearer ${token}`);

    console.log(res.body);
    chai.expect(res.body.data.data[0].lastName).to.be.equal('Potter');
  });

  it('should reject invalid email during update', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/guests/${guestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Harry',
        lastName: 'Potter',
        emailAddress: 'harryp00.example.com',
        phoneNumber: '+1234567890',
      });

    chai
      .expect(res.body.message)
      .to.be.equal('email must be a valid email address');
  });

  it('should update a valid guest', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/guests/${guestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Harry',
        lastName: 'Potter',
        emailAddress: 'harryp@example.com',
        phoneNumber: '+99094567890',
      });

    expect(res.body.message).to.be.equal(
      `Guest with the id: ${guestId} successfully updated`
    );
  });

  it('should paginate guests', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/guests?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array').with.length.at.most(2);
  });

  it('should delete an guest by ID', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/guests/${guestId}`)
      .set('Authorization', `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(`Guest with the id: ${guestId} successfully deleted`);
  });
});
