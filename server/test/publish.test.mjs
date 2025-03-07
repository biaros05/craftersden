import request from "supertest";
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import mongoose from 'mongoose';
import { OAuthService } from '../utils/auth.mjs';

let findOneAndUpdateStubPublish;
let findUserStubPublish;
let findBuildsStubPublish;
let OAuthClientCreateClientStub;
let OAuthClientStub;
let cookie;

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

describe('Post publish endpoints', () => {
  before(() => {
    findOneAndUpdateStubPublish = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    findOneAndUpdateStubPublish.resolves(testPostNotPublished);

    findUserStubPublish = Sinon.stub(mongoose.Model, 'findOne');
    findUserStubPublish.resolves({_id: 'bob'});

    findBuildsStubPublish = Sinon.stub(mongoose.Model, 'find');
    findBuildsStubPublish.resolves(testPostIsPublished);
    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');

    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
    OAuthClientStub.resolves(initialTestUser);
  });

  it('Should publish a build successfully', async () => {
    const loginResp = await request(app).post('/api/auth').
      send({token: 'faketoken'});
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    const response = await request(app).
      post('/api/post/publish').
      field('buildId', '9898').
      set('Cookie', cookie);

    const query = await request(app).
      get('/api/user/user@test.com/builds').
      set('Cookie', cookie);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Build published successfully!');
    expect(query.body.builds).to.deep.equal(testPostIsPublished);
    expect(query.body.message).to.equal('Builds retrieved!');
    return;
  });

  it('should unpublish a build successfully', async () => {

  });

  after(() => {
    findOneAndUpdateStubPublish.restore();
    findUserStubPublish.restore();
    findBuildsStubPublish.restore();
    OAuthClientCreateClientStub.restore();
    OAuthClientStub.restore();
  })
});