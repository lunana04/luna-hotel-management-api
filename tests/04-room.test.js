import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import app from '../app.js';

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let token;
export let roomId;
export let anotherRoomId;

describe('Room', () => {
  it('should reject missing token', async () => {
    const res = await chai.request(app).get('/api/v1/rooms');

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

  it('should reject non-enum roomType', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomType: 'FAMILY',
        pricePerNight: 300,
        availabilityStatus: 'AVAILABLE',
      });
    chai
      .expect(res.body.message)
      .to.be.equal('roomType must be one of: SINGLE, DOUBLE, SUITE');
  });

  it('should retrieve all rooms', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array');
  });

  it('should retrieve an room by ID', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/rooms/${roomId}`)
      .set('Authorization', `Bearer ${token}`);
    chai.expect(res.body.data.roomType).to.be.equal('SUITE');
  });

  it('should filter rooms by availabilityStatus', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/rooms?availabilityStatus=AVAILABLE')
      .set('Authorization', `Bearer ${token}`);

    console.log(res.body);
    chai.expect(res.body.data.data[0].roomType).to.be.equal('SUITE');
  });

  it('should sort rooms by pricePerNight', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/rooms?sortBy=pricePerNight')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].roomType).to.be.equal('SUITE');
  });

  it('should reject non-positive pricePerNight during update', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/rooms/${roomId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomType: 'SUITE',
        pricePerNight: -300,
        availabilityStatus: 'AVAILABLE',
      });

    chai
      .expect(res.body.message)
      .to.be.equal('pricePerNight must be a positive value');
  });

  it('should update a valid room', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/rooms/${roomId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomType: 'SUITE',
        pricePerNight: 300,
        availabilityStatus: 'RESERVED',
      });
    expect(res.body.message).to.be.equal(
      `Room with the id: ${roomId} successfully updated`
    );
  });

  it('should paginate rooms', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/rooms?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array').with.length.at.most(2);
  });

  it('should delete an room by ID', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/rooms/${roomId}`)
      .set('Authorization', `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(`Room with the id: ${roomId} successfully deleted`);
  });
});
