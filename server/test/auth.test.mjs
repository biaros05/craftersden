import request from 'supertest';
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import mongoose from 'mongoose';
import { OAuthService } from '../utils/auth.mjs';

let dbFindOneAndUpdateStub;
let dbFindOneStub;
let OAuthClientCreateClientStub;
let OAuthClientStub;

let cookie;

const testUser = {
  username: 'testUser',
  email: 'test.user@test.com',
  avatar: 'googlepicture.com'
};

describe('Tests authentication routes', () => {
  before(() => {
    dbFindOneStub = Sinon.stub(mongoose.Model, 'findOne');
    dbFindOneStub.resolves(testUser);

    dbFindOneAndUpdateStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    dbFindOneAndUpdateStub.resolves(testUser);

    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');

    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
    OAuthClientStub.resolves({
      name: testUser.username,
      email: testUser.email,
      picture: testUser.avatar
    });
  });

  it('should login and return the user', async () => {
    const response = await request(app).
      post('/api/auth').
      send({
        token: 'faketoken'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({user: testUser});
    cookie = response.headers['set-cookie'][0].split(';')[0];
  });

  it('should return the user info when the user is logged in', async () => {
    const response = await request(app).
      get('/api/query').
      set('Cookie', cookie);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({user: testUser});
  });

  it('should NOT return the user info when the user isnt logged in', async () => {
    const response = await request(app).
      get('/api/query');

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({});
  });

  it('should clear the cookie when the user logs out', async () => {
    const response = await request(app).
      get('/api/logout').
      set('Cookie', cookie);
    
    expect(response.status).to.equal(200);
    expect(response.headers['set-cookie'].includes(cookie)).to.be.false;
  });

  after(() => {
    dbFindOneStub.restore();
    dbFindOneAndUpdateStub.restore();
    OAuthClientCreateClientStub.restore();
    OAuthClientStub.restore();
  });
});
