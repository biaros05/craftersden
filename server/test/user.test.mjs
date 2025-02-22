import request from 'supertest';
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import BlobServiceProvider from '../utils/BlobService.mjs';
import { OAuthService } from '../utils/auth.mjs';
import mongoose from 'mongoose';

let blobServiceConstructorStub;
let saveImageStub;
let userFindOneAndUpdateStub;
let dbFindOneStub;
let OAuthClientCreateClientStub;
let OAuthClientStub;

const initialTestUser = {
  username: 'tester',
  email: 'user@test.com',
  avatar: 'testurl.com'
};

const finalTestuser = {
  username: 'newname',
  email: 'user@test.com',
  avatar: BlobServiceProvider.blobPublicUrl + 'image',
  customized: true
};

let cookie;

describe('User profile endpoints', () => {
  before(() => {
    dbFindOneStub = Sinon.stub(mongoose.Model, 'findOne');
    dbFindOneStub.resolves(initialTestUser);

    userFindOneAndUpdateStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    userFindOneAndUpdateStub.callsFake(async (filter, params) => {
      if (!params.customized) {
        return initialTestUser;
      }

      const user = {
        ...filter,
        ...params
      };
      
      return user;
    });

    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');

    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
    OAuthClientStub.resolves(initialTestUser);

    blobServiceConstructorStub = Sinon.stub(BlobServiceProvider.prototype, 'initializeFields');
    saveImageStub = Sinon.stub(BlobServiceProvider.prototype, 'saveFile').
      resolves('https://imageblobbed.blob.core.windows.net/imageblob/image');
  });

  it('should update user in db', async () => {
    const loginResp = await request(app).post('/api/auth').
      send({token: 'faketoken'});
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    const response = await request(app).
      put('/api/user').
      field('username', 'newname').
      attach('avatar', Buffer.from('somebits'), {filename: 'image.png', contentType: 'image/png'}).
      set('Cookie', cookie);

    const query = await request(app).
      get('/api/query').
      set('Cookie', cookie);
    
    expect(query.body.user).to.deep.equal(finalTestuser);
    expect(response.status).to.equal(200);
  });

  after(() => {
    dbFindOneStub.restore();
    userFindOneAndUpdateStub.restore();
    blobServiceConstructorStub.restore();
    saveImageStub.restore();
    OAuthClientCreateClientStub.restore();
    OAuthClientStub.restore();
  });
});
