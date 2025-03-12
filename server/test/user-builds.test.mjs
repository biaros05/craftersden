import request from 'supertest';
import * as chai from 'chai';
import { describe, it, after, before } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import mongoose from 'mongoose';
import { OAuthService } from '../utils/auth.mjs';

const initialTestUser = {
  username: 'tester',
  email: 'user@test.com',
  avatar: 'testurl.com'
};

const testPost = {
  'description': 'This is a test build',
  'user': 'userID',
  'buildJSON': {'current': {}},
  'isPublished': false,
  'thumnails': [],
  'progressPicture': 'sampleURL'
};

let getUserStub;
let getPostsStub;
let OAuthClientCreateClientStub;
let OAuthClientStub;
let cookie;
let userFindOneAndUpdateStub;

describe('Test the /api/user/builds endpoint', () => {

  before(() => {
    userFindOneAndUpdateStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    userFindOneAndUpdateStub.callsFake(async (filter, params) => {
      if (!params.customized) {
        return initialTestUser;
      }

      const user = {
        ...filter,
        ...params
      };

      if (!params.avatar) {
        user.avatar = initialTestUser.avatar;
      }

      if (!params.username) {
        user.username = initialTestUser.username;
      }
      
      return user;
    });

    getUserStub = Sinon.stub(mongoose.Model, 'findOne');
    getPostsStub = Sinon.stub(mongoose.Model, 'find');

    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');

    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
    OAuthClientStub.resolves(initialTestUser);
  });

  it('should get the users saved builds', async () => {
    const loginResp = await request(app).post('/api/auth').
      send({token: 'faketoken'});
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    getUserStub.resolves(initialTestUser);
    getPostsStub.resolves([testPost]);
    const response = await request(app).get('/api/user/user@test.com/builds').
      set('Cookie', cookie);
    
    expect(response.status).to.equal(200);
    expect(response.body.builds).to.deep.equal([testPost]);
    return;
  });

  it('should return an error if the user does not exist', async () => {
    const loginResp = await request(app).post('/api/auth').
      send({token: 'faketoken'});
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    getUserStub.resolves(undefined);

    const response = await request(app).get('/api/user/no@gmail.com/builds').
      set('Cookie', cookie);
    
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({message: 'this user does not exist'});
    return;
  });

  after(() => {
    getUserStub.restore();
    getPostsStub.restore();
    Sinon.restore();
    OAuthClientCreateClientStub.restore();
    OAuthClientStub.restore();
    userFindOneAndUpdateStub.restore();
  }); 
});
