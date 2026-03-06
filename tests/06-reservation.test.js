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
export let anotherReservationId;

describe('Reservation', () => {
  it('should reject missing token', async () => {
    const res = await chai.request(app).get('/api/v1/reservations');
    expect(res.body.message).to.equal('No token provided');
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

  it('should login an admin user and return a token', async () => {
    const res = await chai.request(app).post('/api/v1/auth/login').send({
      emailAddress: 'john.doe@example.com',
      password: 'password123',
    });

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
        emailAddress: 'harryp@example.com',
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

  it('should reject when checkOutDate is before checkInDate', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        guestId,
        roomId,
        checkInDate: 20240505,
        checkOutDate: 20240501,
      });
    chai
      .expect(res.body.message)
      .to.be.equal('checkOutDate should be greater than checkInDate');
  });

  it('should retrieve all reservations', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/reservations')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data).to.be.an('array');
  });

  it('should retrieve an reservation by checkInDate', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${token}`);
    chai.expect(res.body.data.checkInDate).to.be.equal(20240501);
  });

  it('should filter reservations by name', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/reservations?checkOutDate=20240505')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].checkOutDate).to.be.equal(20240505);
  });

  it('should sort reservations by name', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/reservations?sortBy=checkOutDate')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].checkOutDate).to.be.equal(20240505);
  });

  it('should reject non-interger checkInDate during update', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        guestId,
        roomId,
        checkInDate: 0.555,
        checkOutDate: 20240501,
      });

    chai
      .expect(res.body.message)
      .to.be.equal('checkInDate should be an integer');
  });

  it('should update a valid reservation', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        guestId,
        roomId,
        checkInDate: 20240630,
        checkOutDate: 20240701,
      });

    expect(res.body.message).to.be.equal(
      `Reservation with the id: ${reservationId} successfully updated`
    );
  });

  it('should paginate reservations', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/reservations?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array').with.length.at.most(2);
  });

  it('should delete an reservation by ID', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(
        `Reservation with the id: ${reservationId} successfully deleted`
      );
  });
});
