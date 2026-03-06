import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import app from '../app.js';

const chai = chaiModule.use(chaiHttp);
const expect = chai.expect;

let token;
let employeeId;
export let anotherEmployeeId;

describe('Employee', () => {
  it('should reject missing token', async () => {
    const res = await chai.request(app).get('/api/v1/employees');

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

  it('should create a valid employee', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Sirius',
        lastName: 'Black',
        position: 'MANAGER',
        emailAddress: 'siriusblack@exmaple.com',
        phoneNumber: '+2986567890',
      });
    expect(res.body.message).to.be.equal('Employee successfully created');
    employeeId = res.body.data.data[0].employeeId;
  });

  it('should reject invalid position', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Sirius',
        lastName: 'Black',
        position: 'House Elf',
        emailAddress: 'siriusblack@exmaple.com',
        phoneNumber: '+2986567890',
      });
    chai
      .expect(res.body.message)
      .to.be.equal(
        'position must be one of: MANAGER, RECEPTIONIST, HOUSEKEEPING, SECURITY, OTHER'
      );
  });

  it('should retrieve all employees', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/employees')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data).to.be.an('array');
  });

  it('should retrieve an employee by ID', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`);
    chai.expect(res.body.data.firstName).to.be.equal('Sirius');
  });

  it('should filter employees by position', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/employees?position=MANAGER')
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    chai.expect(res.body.data.data[0].position).to.be.equal('MANAGER');
  });

  it('should sort employees by lastName', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/employees?sortBy=lastName')
      .set('Authorization', `Bearer ${token}`);

    chai.expect(res.body.data.data[0].lastName).to.be.equal('Black');
  });

  it('should reject invalid emailAddress during update', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Sirius',
        lastName: 'Black',
        position: 'MANAGER',
        emailAddress: 'siriusblackcom',
        phoneNumber: '+2986567890',
      });

    chai
      .expect(res.body.message)
      .to.be.equal('emailAddress must be a valid email address');
  });

  it('should update a valid employee', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Sirius',
        lastName: 'Black',
        position: 'OTHER',
        emailAddress: 'siriusblack@exmaple.com',
        phoneNumber: '+2986567890',
      });

    expect(res.body.message).to.be.equal(
      `Employee with the id: ${employeeId} successfully updated`
    );
  });

  it('should paginate employees', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/employees?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.data).to.be.an('array').with.length.at.most(2);
  });

  it('should delete an employee by ID', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(`Employee with the id: ${employeeId} successfully deleted`);
  });
});
