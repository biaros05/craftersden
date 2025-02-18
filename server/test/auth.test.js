import request from 'supertest';
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import mongoose from 'mongoose';
// import OAuthService from '../utils/auth';

let dbStub;
let OAuthClientStub;

const testUser = {
  username: 'testUser',
  email: 'test.user@test.com',
  avatar: 'googlepicture.com'
};

describe.skip('Tests authentication routes', () => {
  before(() => {
    dbStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    dbStub.resolves(testUser);

    OAuthClientStub = Sinon.stub(OAuthService, 'verifyToken');
    OAuthClientStub.resolves({
      name: testUser.username,
      email: testUser.email,
      picture: testUser.avatar
    });
  });

  it('should return the user', async () => {
    const response = await request(app).
      post('/api/auth').
      send({
        token: 'faketoken'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ alive: true });
  });

  after(() => {
    dbStub.restore();
    OAuthClientStub.restore();
  });
});
