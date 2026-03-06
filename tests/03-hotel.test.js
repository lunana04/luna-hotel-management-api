import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe, it} from 'mocha';

import app from '../app.js';

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let token;
let hotelId;
export let anotherHotelId;

describe('Hotel', () => {
  it('should reject missing token', async () => {
    const res = await chai.request(app).get('/api/v1/hotels');

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
  
  it('should create a valid hotel', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/hotels')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Luna Hotel',
        location: 'New Zealand',
        starRating: 5,
        phoneNumber: '+1234567890',
      });

    expect(res.body.message).to.be.equal('Hotel successfully created');
    hotelId = res.body.data.data[0].hotelId;
  });

  it('should reject non-string hotelName', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/hotels')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 411,
        location: 'New Zealand',
        starRating: 5,
        phoneNumber: '+1234567890',
      });
    chai.expect(res.body.message).to.be.equal('name should be a string');
  });

  it('should retrieve all hotels', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/hotels')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array');
  });

  it('should retrieve an hotel by ID', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${token}`);
    chai.expect(res.body.data.name).to.be.equal('Luna Hotel');
  });

  it('should filter hotels by name', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/hotels?name=Luna Hotel')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].name).to.be.equal('Luna Hotel');
  });

  it('should sort hotels by name', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/hotels?sortBy=name')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].name).to.be.equal('Luna Hotel');
  });

  it('should reject non-number starRating during update', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Luna Hotel',
        location: 'New Zealand',
        starRating: 'five',
        phoneNumber: '+1234567890',
      });

    chai.expect(res.body.message).to.be.equal('starRating should be a number');
  });

  it('should update a valid hotel', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Luna Hotel',
        location: 'New Zealand',
        starRating: 5,
        phoneNumber: '+0234567890',
      });

    expect(res.body.message).to.be.equal(
      `Hotel with the id: ${hotelId} successfully updated`
    );
  });

  it('should paginate hotels', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/hotels?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array').with.length.at.most(2);
  });

  it('should delete an hotel by ID', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(`Hotel with the id: ${hotelId} successfully deleted`);
  });
});
