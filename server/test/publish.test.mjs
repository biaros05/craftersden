import request from "supertest";
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import { OAuthService } from '../utils/auth.mjs';
import mongoose from 'mongoose';

let findOneAndUpdateStub;
let findUserStub;
let findBuildsStub;
let OAuthClientCreateClientStub;
let OAuthClientStub;

const testPostNotPublished = {
  '_id': '9898',
  'description': "This is my first build on den!",
  'user': '1',
  'buildJSON' : [{}],
  'isPublished': false,
  'thumbnails': [],
  'progressPicture': 'myPictureUrl'
}

const testPostIsPublished = {
  '_id': '9898',
  'description': "This is my first build on den!",
  'user': '1',
  'buildJSON' : [{}],
  'isPublished': true,
  'thumbnails': [],
  'progressPicture': 'myPictureUrl'
}



const initialTestUser = {
  username: 'tester',
  email: 'user@test.com',
  avatar: 'testurl.com'
};

let cookie;


describe('Post publish endpoints', () => {
  before(() => {
    findOneAndUpdateStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    findOneAndUpdateStub.resolves(testPostNotPublished);

    findUserStub = Sinon.stub(mongoose.Model, 'findOne');
    findUserStub.resolves({_id: 'bob'});

    findBuildsStub = Sinon.stub(mongoose.Model, 'find');
    findBuildsStub.resolves(testPostIsPublished);

    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');

    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
    OAuthClientStub.resolves(initialTestUser);
  });

  it('Should should publish a build successfully', async () => {
    const loginResp = await request(app).post('/api/auth').
      send({token: 'faketoken'});
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    const response = await request(app).
      post('/api/post/publish').
      field('buildId', '9898');

    const query = await request(app).
      get('/api/user/user@test.com/builds').
      set('Cookie', cookie);

    expect(response.status).to.equal(200);
    expect(response.message).to.equal('Build published successfully!');
    expect(query.body.builds).to.deep.equal([testPostIsPublished]);
    expect(query.body.message).to.equal('Builds retrieved!');
    return;
  });

  after(() => {
    findOneAndUpdateStub.restore();
    findUserStub.restore();
    findBuildsStub.restore();
  })
});