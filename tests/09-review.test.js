import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import app from '../app.js';

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let token;
let guestId;
let hotelId;
let reviewId;
export let anotherReviewId;

describe('Review', () => {
  it('should reject missing token', async () => {
    const res = await chai.request(app).get('/api/v1/reviews');

    chai.expect(res.body.message).to.be.equal('No token provided');
  });

  it('should login an admin user and return a token', async () => {
    const res = await chai.request(app).post('/api/v1/auth/login').send({
      emailAddress: 'john.doe@example.com',
      password: 'password123',
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
        firstName: 'Hermione',
        lastName: 'Granger',
        emailAddress: 'Hermione@example.com',
        phoneNumber: '+1234567890',
      });
    expect(res.body.message).to.be.equal('Guest successfully created');
    guestId = res.body.data.data[0].guestId;
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

  it('should create a valid review', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        guestId,
        hotelId,
        rating: 5,
        comment: 'The hotel was fantastic!',
      });
    expect(res.body.message).to.be.equal('Review successfully created');
    reviewId = res.body.data.data[0].reviewId;
  });

  it('should reject non-string comment', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        guestId,
        hotelId,
        rating: 5,
        comment: 10,
      });
    chai.expect(res.body.message).to.be.equal('comment should be a string');
  });

  it('should retrieve all reviews', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/reviews')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data).to.be.an('array');
  });

  it('should retrieve an review by ID', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);
    chai.expect(res.body.data.rating).to.be.equal(5);
  });

  it('should filter reviews by rating', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/reviews?reviewName=Cleaning')
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    chai
      .expect(res.body.data.data[0].comment)
      .to.be.equal('The hotel was fantastic!');
  });

  it('should sort reviews by rating', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/reviews?sortBy=rating')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].rating).to.be.equal(5);
  });

  it('should reject non-number rating during update', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        guestId,
        hotelId,
        rating: 'five',
        comment: 'The hotel was fantastic!',
      });

    chai.expect(res.body.message).to.be.equal('rating should be a number');
  });

  it('should update a valid review', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        guestId,
        hotelId,
        rating: 5,
        comment: 'The hotel was fantastic! I would recommend it to everyone.',
      });

    expect(res.body.message).to.be.equal(
      `Review with the id: ${reviewId} successfully updated`
    );
  });

  it('should paginate reviews', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/reviews?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array').with.length.at.most(2);
  });

  it('should delete an review by ID', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(`Review with the id: ${reviewId} successfully deleted`);
  });
});
