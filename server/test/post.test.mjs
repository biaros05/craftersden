import request from 'supertest';
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import Sinon from 'sinon';
import BlobServiceProvider from '../utils/BlobService.mjs';
import { OAuthService } from '../utils/auth.mjs';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import {encode} from '@msgpack/msgpack'; 

let blobServiceConstructorStub;
let findUserStub;
let findPostStub;
let saveImageStub;
let findOneAndUpdateStub;
let OAuthClientCreateClientStub;
let OAuthClientStub;
let saveStub;

const initialTestUser = {
  username: 'tester',
  email: 'user@test.com',
  avatar: 'testurl.com'
};

const testPostWithURL = {
  '_id': 5678,
  'description': 'This is a test build',
  'user': 'newPost',
  'buildJSON': [{}],
  'isPublished': false,
  'thumnails': [],
  'progressPicture': BlobServiceProvider.blobPublicUrl + 'image',
};

const preExistingPost = {
  '_id': 1234,
  'description': 'This is a test build',
  'user': 'preExisting',
  'buildJSON': [{}],
  'isPublished': false,
  'thumnails': [],
  'progressPicture': BlobServiceProvider.blobPublicUrl + 'image',
};

let cookie;

describe('Post endpoints', () => {
  before(() => {
    findOneAndUpdateStub = Sinon.stub(mongoose.Model, 'findOneAndUpdate');
    saveStub = Sinon.stub(Post.prototype, 'save');
    saveStub.resolves();


    findOneAndUpdateStub.resolves(preExistingPost);

    /* eslint-disable-next-line no-unused-vars */
    findOneAndUpdateStub.callsFake(async (filter, params) => {

      if (filter._id === '1234') {
        return preExistingPost;
      }

      // give it an ID (like 'creating' it)
      const post = {
        _id: 5678,
        ...testPostWithURL
      };
      
      return post;
    });

    
    findUserStub = Sinon.stub(mongoose.Model, 'findOne');

    /* eslint-disable-next-line no-unused-vars */
    findUserStub.callsFake(async (filter, params) => {

      if (filter.email === 'user@test.com') {
        return {_id: 'newUser'};
      } 

      return {_id: 'oldUser'};
    });

    findPostStub = Sinon.stub(mongoose.Model, 'find');

    /* eslint-disable-next-line no-unused-vars */
    findPostStub.callsFake(async (filter, params) => {

      if (filter.user === 'newUser') {
        return [testPostWithURL];
      } 

      return [preExistingPost];
    });
    


    OAuthClientCreateClientStub = Sinon.stub(OAuthService.prototype, 'createClient');

    OAuthClientStub = Sinon.stub(OAuthService.prototype, 'verifyToken');
    OAuthClientStub.resolves(initialTestUser);

    blobServiceConstructorStub = Sinon.stub(BlobServiceProvider.prototype, 'initializeFields');
    saveImageStub = Sinon.stub(BlobServiceProvider.prototype, 'overrideFile').
      resolves(BlobServiceProvider.blobPublicUrl + 'image');
  });

  it('should save post with url', async () => {
    const loginResp = await request(app).post('/api/auth').
      send({token: 'faketoken'});
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    const arrayBufferBlocks  = encode('{}');
    const blocksBuffer = Buffer.from(await new Blob([arrayBufferBlocks]).arrayBuffer());
    
    const response = await request(app).
      post('/api/post/save').      
      attach('png', Buffer.from('somebits'), {filename: 'image.png', contentType: 'image/png'}).
      attach('blocks', blocksBuffer, {filename: 'blob.json'}).
      field('email', 'user@test.com').
      field('buildId', 'null').
      set('Cookie', cookie);


    const query = await request(app).
      get('/api/user/user@test.com/builds').
      set('Cookie', cookie);
    
    expect(query.body.builds).to.deep.equal([testPostWithURL]);
    expect(response.status).to.equal(200);
    expect(query.body.message).to.equal('Builds retrieved!');
    return;
  });

  it('should save existing post with url', async () => {
    const loginResp = await request(app).post('/api/auth').
      send({token: 'faketoken'});
    cookie = loginResp.headers['set-cookie'][0].split(';')[0];

    const arrayBufferBlocks  = encode('{}');
    const blocksBuffer = Buffer.from(await new Blob([arrayBufferBlocks]).arrayBuffer());
    
    const response = await request(app).
      post('/api/post/save').      
      attach('png', Buffer.from('somebits'), {filename: 'image.png', contentType: 'image/png'}).
      attach('blocks', blocksBuffer, {filename: 'blob.json'}).
      field('email', 'old@test.com').
      field('buildId', '1234').
      set('Cookie', cookie);


    const query = await request(app).
      get('/api/user/old@test.com/builds').
      set('Cookie', cookie);
    
    expect(query.body.builds).to.deep.equal([preExistingPost]);
    expect(response.status).to.equal(200);
    expect(query.body.message).to.equal('Builds retrieved!');
    return;
  });

  it('should fail when user not logged in', async () => {
    const response = await request(app).
      post('/api/post/save').      
      attach('png', Buffer.from('somebits'), {filename: 'image.png', contentType: 'image/png'}).
      attach('blocks', Buffer.from('somebits'), {filename: 'blob.json', 
        contentType: 'application/octet-stream'});
    
    expect(response.status).to.equal(401);
    return;
  });

  after(() => {
    findUserStub.restore();
    findPostStub.restore();
    findOneAndUpdateStub.restore();
    blobServiceConstructorStub.restore();
    saveImageStub.restore();
    OAuthClientCreateClientStub.restore();
    OAuthClientStub.restore();
  });
});
