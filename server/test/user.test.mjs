import request from 'supertest';
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import User from '../models/User.mjs';
import BlobServiceProvider from '../utils/BlobService.mjs';

let blobServiceConstructorStub;
let saveImageStub;
let userFindOneAndUpdateStub;

const testUser = {
  username: 'tester',
  email: 'user@test.com',
  avatar: 'testurl.com'
};

describe('User profile endpoints', () => {
  before(() => {
    userFindOneAndUpdateStub = Sinon.stub(User, 'findOneAndUpdate');
    userFindOneAndUpdateStub.withArgs(
      {email: 'user@test.com'}, 
      {avatar: 'testurl.com', username: 'tester', customized: true},
      {returnDocument: 'after'}
    ).resolves(testUser);

    blobServiceConstructorStub = Sinon.stub(BlobServiceProvider.prototype, 'initializeFields');
    saveImageStub = Sinon.stub(BlobServiceProvider.prototype, 'saveFile').
      resolves('testurl.com');
  });

  it('should update user in db', async () => {
    const response = await request(app).
      put('/api/user').
      field('username', 'tester').
      attach('avatar', Buffer.from('somebits'), {filename: 'image.png', contentType: 'image/png'});
    
    expect(response.status).to.equal(200);
  });

  after(() => {
    userFindOneAndUpdateStub.restore();
    blobServiceConstructorStub.restore();
    saveImageStub.restore();
  });
});
