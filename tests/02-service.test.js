import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import app from '../app.js';

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let token;
let serviceId;
export let anotherServiceId;

describe('Service', () => {
  it('should reject missing token', async () => {
    const res = await chai.request(app).get('/api/v1/services');

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

  it('should create a valid service', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/services')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hotelId: '550e8400-e29b-41d4-a716-446655440000',
        serviceName: 'Cleaning',
        price: 123.45,
        description: 'New Zealand',
      });
    expect(res.body.message).to.be.equal('Service successfully created');
    serviceId = res.body.data.data[0].serviceId;
  });

  it('should reject non-string serviceName', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/services')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hotelId: '550e8400-e29b-41d4-a716-446655440000',
        serviceName: 123,
        price: 123.45,
        description: 'New Zealand',
      });
    chai.expect(res.body.message).to.be.equal('serviceName should be a string');
  });

  it('should retrieve all services', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/services')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data).to.be.an('array');
  });

  it('should retrieve an service by ID', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/services/${serviceId}`)
      .set('Authorization', `Bearer ${token}`);
    chai.expect(res.body.data.serviceName).to.be.equal('Cleaning');
  });

  it('should filter services by name', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/services?serviceName=Cleaning')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].serviceName).to.be.equal('Cleaning');
  });

  it('should sort services by name', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/services?sortBy=serviceName')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].serviceName).to.be.equal('Cleaning');
  });

  it('should reject non-string description during update', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/services/${serviceId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        serviceName: 'Cleaning',
        price: 123.45,
        description: 1234,
      });

    chai.expect(res.body.message).to.be.equal('description should be a string');
  });

  it('should update a valid service', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/services/${serviceId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        serviceName: 'Cleaning',
        price: 200,
        description: 'New Zealand',
      });

    expect(res.body.message).to.be.equal(
      `Service with the id: ${serviceId} successfully updated`
    );
  });

  it('should paginate services', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/services?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array').with.length.at.most(2);
  });

  it('should delete an service by ID', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/services/${serviceId}`)
      .set('Authorization', `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(`Service with the id: ${serviceId} successfully deleted`);
  });
});
