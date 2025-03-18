import request from 'supertest';
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import mongoose from 'mongoose';
import { OAuthService } from '../utils/auth.mjs';


let findOneAndUpdateStubLikes;
let findUserStubLikes;
let findBuildsStubLikes;
let OAuthClientCreateClientStub;
let OAuthClientStub;
let cookie;

const testPostIsLiked = {
  '_id': '1111',
  'description': 'This is my first build on den!',
  'user': '656a3c9d5d42a2d9b3c5e2f4',
  'buildJSON' : [{}],
  'isPublished': false,
  'thumbnails': [],
  'progressPicture': 'myPictureUrl',
  'likedBy': ['656a3c9d5d42a2d9b3c5e2f4'],
  'savedBy': []
};

const testPostNotLiked= {
  '_id': '1111',
  'description': 'This is my first build on den!',
  'user': '656a3c9d5d42a2d9b3c5e2f4',
  'buildJSON' : [{}],
  'isPublished': true,
  'thumbnails': [],
  'progressPicture': 'myPictureUrl',
  'likedBy': [],
  'savedBy': []
};

const initialTestUser = {
  username: 'tester',
  email: 'user@test.com',
  avatar: 'testurl.com'
};

describe('Post like endpoints', () => {
  before(() => {
    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');
    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
    OAuthClientStub.resolves(initialTestUser);
  });

  afterEach(() => {
    findOneAndUpdateStubLikes.restore();
    findUserStubLikes.restore();
    findBuildsStubLikes.restore();
  });

  it('should unlike a post', async () => {
    findOneAndUpdateStubLikes = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    findOneAndUpdateStubLikes.resolves(testPostIsLiked);

    findUserStubLikes = Sinon.stub(mongoose.Model, 'findOne');
    findUserStubLikes.resolves({_id: '656a3c9d5d42a2d9b3c5e2f4'});

    findBuildsStubLikes = Sinon.stub(mongoose.Model, 'find');
    findBuildsStubLikes.resolves(testPostIsLiked);

    const loginResp = await request(app).post('/api/auth').
      send({token: 'faketoken'});
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
    expect(query.body.builds).to.deep.equal(testPostIsLiked);
    expect(query.body.message).to.equal('Builds retrieved!');
    return;
  });


  it('should like a post', async () => {
    findOneAndUpdateStubLikes = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    findOneAndUpdateStubLikes.resolves(testPostNotLiked);

    findUserStubLikes = Sinon.stub(mongoose.Model, 'findOne');
    findUserStubLikes.resolves({_id: '656a3c9d5d42a2d9b3c5e2f4'});

    findBuildsStubLikes = Sinon.stub(mongoose.Model, 'find');
    findBuildsStubLikes.resolves(testPostNotLiked);

    const loginResp = await request(app).post('/api/auth').
      send({token: 'faketoken'});
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
    expect(query.body.builds).to.deep.equal(testPostNotLiked);
    return;
  })

    after(() => {
      findOneAndUpdateStubLikes.restore();
      findUserStubLikes.restore();
      findBuildsStubLikes.restore();
      OAuthClientCreateClientStub.restore();
      OAuthClientStub.restore();
    })
})