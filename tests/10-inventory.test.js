import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import app from '../app.js';

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let token;
let hotelId;
let inventoryId;
export let anotherInventoryId;

describe('Inventory', () => {
  it('should reject missing token', async () => {
    const res = await chai.request(app).get('/api/v1/Inventory');

    chai.expect(res.body.message).to.be.equal('No token provided');
  });

  it('should login an admin user and return a token', async () => {
    const res = await chai.request(app).post('/api/v1/auth/login').send({
      emailAddress: 'john.doe@example.com',
      password: 'password123',
    });

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

  it('should create a valid inventory', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/Inventory')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hotelId,
        itemName: 'Towel',
        quantity: 100,
        pricePerItem: 10.99,
      });
    expect(res.body.message).to.be.equal('Inventory successfully created');
    inventoryId = res.body.data.data[0].inventoryId;
  });

  it('should reject non-string itemName', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/Inventory')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hotelId,
        itemName: 987,
        quantity: 100,
        pricePerItem: 10.99,
      });
    chai.expect(res.body.message).to.be.equal('itemName should be a string');
  });

  it('should retrieve all Inventory', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/Inventory')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data).to.be.an('array');
  });

  it('should retrieve an inventory by ID', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/Inventory/${inventoryId}`)
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.itemName).to.be.equal('Towel');
  });

  it('should filter Inventory by itemName', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/Inventory?itemName=Towel')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].itemName).to.be.equal('Towel');
  });

  it('should sort Inventory by quantity', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/Inventory?sortBy=quantity')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].quantity).to.be.equal(100);
  });

  it('should reject non-number quantity during update', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/Inventory/${inventoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        hotelId,
        itemName: 'Cleaning',
        quantity: 'one hundred',
        pricePerItem: 10.99,
      });

    chai.expect(res.body.message).to.be.equal('quantity should be a number');
  });

  it('should update a valid inventory', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/Inventory/${inventoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        hotelId,
        itemName: 'Cleaning',
        quantity: 90,
        pricePerItem: 10.99,
      });

    expect(res.body.message).to.be.equal(
      `Inventory with the id: ${inventoryId} successfully updated`
    );
  });

  it('should paginate Inventory', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/Inventory?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array').with.length.at.most(2);
  });

  it('should delete an inventory by ID', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/Inventory/${inventoryId}`)
      .set('Authorization', `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(
        `Inventory with the id: ${inventoryId} successfully deleted`
      );
  });
});
