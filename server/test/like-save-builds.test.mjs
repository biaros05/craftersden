import request from 'supertest';
import * as chai from 'chai';
import { describe, it, before, after, afterEach } from 'mocha';
const expect = chai.expect;
import app from '../api.mjs';
import Sinon from 'sinon';
import mongoose from 'mongoose';
import { OAuthService } from '../utils/auth.mjs';


let findOneAndUpdateStub;
let findUserStub;
let findBuildsStub;
let OAuthClientCreateClientStub;
let OAuthClientStub;
let cookie;

const testPostIsLiked = {
  '_id': '1111',
  'description': 'This is my first build on den!',
  'user': '656a3c9d5d42a2d9b3c5e2f4',
  'buildJSON': [{}],
  'isPublished': false,
  'thumbnails': [],
  'progressPicture': 'myPictureUrl',
  'likedBy': ['656a3c9d5d42a2d9b3c5e2f4'],
  'savedBy': []
};

const testPostNotLiked = {
  '_id': '1111',
  'description': 'This is my first build on den!',
  'user': '656a3c9d5d42a2d9b3c5e2f4',
  'buildJSON': [{}],
  'isPublished': true,
  'thumbnails': [],
  'progressPicture': 'myPictureUrl',
  'likedBy': [],
  'savedBy': []
};

const testPostIsSaved = {
  '_id': '1111',
  'description': 'This is my first build on den!',
  'user': '656a3c9d5d42a2d9b3c5e2f4',
  'buildJSON': [{}],
  'isPublished': false,
  'thumbnails': [],
  'progressPicture': 'myPictureUrl',
  'likedBy': ['656a3c9d5d42a2d9b3c5e2f4'],
  'savedBy': ['656a3c9d5d42a2d9b3c5e2f4']
};


const initialTestUser = {
  username: 'tester',
  email: 'user@test.com',
  avatar: 'testurl.com'
};

describe('POST /api/post/toggle-like', () => {
  before(() => {
    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');
    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
    OAuthClientStub.resolves(initialTestUser);
  });

  afterEach(() => {
    findOneAndUpdateStub.restore();
    findUserStub.restore();
    findBuildsStub.restore();
  });

  it('should unlike a post', async () => {
    findOneAndUpdateStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    findOneAndUpdateStub.resolves(testPostNotLiked);

    findUserStub = Sinon.stub(mongoose.Model, 'findOne');
    findUserStub.resolves({ _id: '656a3c9d5d42a2d9b3c5e2f4' });

    findBuildsStub = Sinon.stub(mongoose.Model, 'find');
    findBuildsStub.resolves(testPostNotLiked);

    const loginResp = await request(app).post('/api/auth').
      send({ token: 'faketoken' });
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    const response = await request(app).
      post('/api/post/toggle-like').
      send({
        id: '656a3c9d5d42a2d9b3c5e2f4',
        buildId: '1111',
        isLiked: false
      }).
      set('Cookie', cookie);

    const query = await request(app).
      get('/api/user/user@test.com/builds').
      set('Cookie', cookie);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Unliked post');
    expect(query.body.builds).to.deep.equal(testPostNotLiked);
    expect(query.body.message).to.equal('Builds retrieved!');
    expect(query.body.builds.likedBy).to.deep.equal([]);
    return;
  });


  it('should like a post', async () => {
    findOneAndUpdateStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    findOneAndUpdateStub.resolves(testPostIsLiked);

    findUserStub = Sinon.stub(mongoose.Model, 'findOne');
    findUserStub.resolves({ _id: '656a3c9d5d42a2d9b3c5e2f4' });

    findBuildsStub = Sinon.stub(mongoose.Model, 'find');
    findBuildsStub.resolves(testPostIsLiked);

    const loginResp = await request(app).post('/api/auth').
      send({ token: 'faketoken' });
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    const response = await request(app).
      post('/api/post/toggle-like').
      send({
        id: '656a3c9d5d42a2d9b3c5e2f4',
        buildId: '1111',
        isLiked: true
      }).
      set('Cookie', cookie);

    const query = await request(app).
      get('/api/user/user@test.com/builds').
      set('Cookie', cookie);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Liked post');
    expect(query.body.message).to.equal('Builds retrieved!');
    expect(query.body.builds).to.deep.equal(testPostIsLiked);
    expect(query.body.builds.likedBy).to.deep.equal(['656a3c9d5d42a2d9b3c5e2f4']);
    return;
  });

  after(() => {
    findOneAndUpdateStub.restore();
    findUserStub.restore();
    findBuildsStub.restore();
    OAuthClientCreateClientStub.restore();
    OAuthClientStub.restore();
  });
});

describe('POST /api/post/toggle-save', () => {
  before(() => {
    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');
    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
    OAuthClientStub.resolves(initialTestUser);
  });

  afterEach(() => {
    findOneAndUpdateStub.restore();
    findUserStub.restore();
    findBuildsStub.restore();
  });

  it('should unsave a post', async () => {
    findOneAndUpdateStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    findOneAndUpdateStub.resolves(testPostIsLiked);

    findUserStub = Sinon.stub(mongoose.Model, 'findOne');
    findUserStub.resolves({ _id: '656a3c9d5d42a2d9b3c5e2f4' });

    findBuildsStub = Sinon.stub(mongoose.Model, 'find');
    findBuildsStub.resolves(testPostIsLiked);

    const loginResp = await request(app).post('/api/auth').
      send({ token: 'faketoken' });
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    const response = await request(app).
      post('/api/post/toggle-save').
      send({
        id: '656a3c9d5d42a2d9b3c5e2f4',
        buildId: '1111',
        isSaved: false
      }).
      set('Cookie', cookie);

    const query = await request(app).
      get('/api/user/user@test.com/builds').
      set('Cookie', cookie);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Unsaved successfully!');
    expect(query.body.message).to.equal('Builds retrieved!');
    expect(query.body.builds).to.deep.equal(testPostIsLiked);
    expect(query.body.builds.savedBy).to.deep.equal([]);
    return;
  });


  it('should save a post', async () => {
    findOneAndUpdateStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    findOneAndUpdateStub.resolves(testPostIsSaved);

    findUserStub = Sinon.stub(mongoose.Model, 'findOne');
    findUserStub.resolves({ _id: '656a3c9d5d42a2d9b3c5e2f4' });

    findBuildsStub = Sinon.stub(mongoose.Model, 'find');
    findBuildsStub.resolves(testPostIsSaved);

    const loginResp = await request(app).post('/api/auth').
      send({ token: 'faketoken' });
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    const response = await request(app).
      post('/api/post/toggle-save').
      send({
        id: '656a3c9d5d42a2d9b3c5e2f4',
        buildId: '1111',
        isSaved: true
      }).
      set('Cookie', cookie);

    const query = await request(app).
      get('/api/user/user@test.com/builds').
      set('Cookie', cookie);


    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Saved successfully!');
    expect(query.body.message).to.equal('Builds retrieved!');
    expect(query.body.builds).to.deep.equal(testPostIsSaved);
    expect(query.body.builds.savedBy).to.deep.equal(['656a3c9d5d42a2d9b3c5e2f4']);
    return;
  });

  after(() => {
    findOneAndUpdateStub.restore();
    findUserStub.restore();
    findBuildsStub.restore();
    OAuthClientCreateClientStub.restore();
    OAuthClientStub.restore();
  });

});