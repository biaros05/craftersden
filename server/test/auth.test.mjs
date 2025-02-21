import request from 'supertest';
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import mongoose from 'mongoose';
import { OAuthService } from '../utils/auth.mjs';

let dbStub;
let OAuthClientCreateClientStub;
let OAuthClientStub;

const testUser = {
  username: 'testUser',
  email: 'test.user@test.com',
  avatar: 'googlepicture.com'
};

describe('Tests authentication routes', () => {
  before(() => {
    dbStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    dbStub.resolves(testUser);

    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');

    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
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
    expect(response.body).to.deep.equal({user: testUser});
  });

  after(() => {
    dbStub.restore();
    OAuthClientCreateClientStub.restore();
    OAuthClientStub.restore();
  });
});
