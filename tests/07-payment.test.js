import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import app from '../app.js';

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let token;
let reservationId;
let guestId;
let roomId;
let paymentId;
export let anotherPaymentId;

describe('Payment', () => {
  it('should reject missing token', async () => {
    const res = await chai.request(app).get('/api/v1/payments');

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

  it('should create a valid room', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomType: 'SUITE',
        pricePerNight: 300,
        availabilityStatus: 'AVAILABLE',
      });

    expect(res.body.message).to.be.equal('Room successfully created');
    roomId = res.body.data.data[0].roomId;
  });

  it('should create a valid guest', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Harry',
        lastName: 'Potter',
        emailAddress: 'harryptr@example.com',
        phoneNumber: '+1234567890',
      });
    expect(res.body.message).to.be.equal('Guest successfully created');
    guestId = res.body.data.data[0].guestId;
  });

  it('should create a valid reservation', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        guestId,
        roomId,
        checkInDate: 20240501,
        checkOutDate: 20240505,
      });
    console.log(res.body);
    expect(res.body.message).to.equal('Reservation successfully created');
    reservationId = res.body.data.data[0].reservationId;
  });

  it('should create a valid payment', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reservationId,
        paymentDate: '2024-05-01T00:00:00.000Z',
        amount: 123.45,
        paymentMethod: 'Credit Card',
      });
    expect(res.body.message).to.be.equal('Payment successfully created');
    paymentId = res.body.data.data[0].paymentId;
  });

  it('should reject negative amount', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reservationId,
        paymentDate: '2024-05-01T00:00:00.000Z',
        amount: -123.45,
        paymentMethod: 'Credit Card',
      });
    chai
      .expect(res.body.message)
      .to.be.equal('amount must be a positive number');
  });

  it('should retrieve all payments', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/payments')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data).to.be.an('array');
  });

  it('should retrieve an payment by ID', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/payments/${paymentId}`)
      .set('Authorization', `Bearer ${token}`);
    chai.expect(res.body.data.paymentMethod).to.be.equal('Credit Card');
  });

  it('should filter payments by paymentMethod', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/payments?paymentMethod=Credit Card')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].amount).to.be.equal(123.45);
  });

  it('should sort payments by amount', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/payments?sortBy=amount')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].amount).to.be.equal(123.45);
  });

  it('should reject non-string paymentMethod during update', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/payments/${paymentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        reservationId,
        paymentDate: '2024-05-01T00:00:00.000Z',
        amount: 123.45,
        paymentMethod: 12345,
      });

    chai
      .expect(res.body.message)
      .to.be.equal('paymentMethod should be a string');
  });

  it('should update a valid payment', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/payments/${paymentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        reservationId,
        paymentDate: '2024-06-01T00:00:00.000Z',
        amount: 300.0,
        paymentMethod: 'Credit Card',
      });

    expect(res.body.message).to.be.equal(
      `Payment with the id: ${paymentId} successfully updated`
    );
  });

  it('should paginate payments', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/payments?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array').with.length.at.most(2);
  });

  it('should delete an payment by ID', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/payments/${paymentId}`)
      .set('Authorization', `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(`Payment with the id: ${paymentId} successfully deleted`);
  });
});
