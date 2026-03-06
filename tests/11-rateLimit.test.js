import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before } from 'mocha';
import app from '../app.js';

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let token;

describe('Rate Limiting', () => {
  before(async () => {
    const res = await chai.request(app).post('/api/v1/auth/login').send({
      emailAddress: 'john.doe@example.com',
      password: 'password123',
    });

    expect(res).to.have.status(200);
    expect(res.body.token).to.exist;
    token = res.body.token;
  });

  describe('GET requests limit (20 requests per 2 minutes)', () => {
    it('should allow 5 GET requests successfully', async () => {
      for (let i = 0; i < 5; i++) {
        const res = await chai.request(app)
          .get('/api/v1/hotels')
          .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
      }
    });
  });

  describe('POST requests limit (10 requests per 1 minute)', () => {
    it('should allow 5 POST requests successfully', async () => {
      for (let i = 0; i < 5; i++) {
        const res = await chai.request(app)
          .post('/api/v1/hotels')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: `Test Hotel ${i}`,
            location: 'Test Location',
            starRating: 3,
            phoneNumber: '+1234567890',
          });

        expect(res).to.have.status(201);
      }
    });
  });
});
