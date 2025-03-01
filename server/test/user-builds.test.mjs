import request from 'supertest';
import * as chai from 'chai';
import { describe, it, after, before } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import mongoose from 'mongoose';

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

describe('Test the /api/user/builds endpoint', () => {

  before(() => {
    getUserStub = Sinon.stub(mongoose.Model, 'findOne');
    getPostsStub = Sinon.stub(mongoose.Model, 'find');
  });

  it('should get the users saved builds', async () => {
    getUserStub.resolves(initialTestUser);
    getPostsStub.resolves([testPost]);
    const response = await request(app).get('/api/user/user@test.com/builds');
    
    expect(response.status).to.equal(200);
    expect(response.body.builds).to.deep.equal([testPost]);
  });

  it('should return an error if the user does not exist', async () => {
    getUserStub.resolves(undefined);

    const response = await request(app).get('/api/user/no@gmail.com/builds');
    
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({message: 'this user does not exist'});
  });

  after(() => {
    getUserStub.restore();
    getPostsStub.restore();
    Sinon.restore();
  }); 
});
