import request from 'supertest';
import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import sinon from 'sinon';
import mongoose from 'mongoose';

const singleBlock = {
  '_id': '1',
  'name': 'acacia_button',
  'cuboids': [
    {
      'from': [0.3125, 0.375, 0.375],
      'to': [0.6875, 0.625, 0.625],
      'faces': {
        'down': {
          'uv': [5, 6, 11, 10],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'up': {
          'uv': [5, 10, 11, 6],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'north': {
          'uv': [5, 12, 11, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'south': {
          'uv': [5, 12, 11, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'west': {
          'uv': [6, 12, 10, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'east': {
          'uv': [6, 12, 10, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        }
      }
    }
  ],
  'inventoryTexture': 'minecraft_acacia_button.png'
};

const multipleBlocks = {
  blocks: [
    {
      '_id': '1',
      'name': 'acacia_log',
      'inventoryTexture': 'minecraft_acacia_log.png'
    },
    {
      '_id': '2',
      'name': 'acacia_button',
      'inventoryTexture': 'minecraft_acacia_button.png'
    }
  ],
  totalBlocks: 2
};

let dbStub;

describe('GET /api/block', () => {

  before(() => {
    dbStub = sinon.stub(mongoose.Model, 'findById');
    dbStub.resolves(singleBlock);  
  });

  it('should return a single block with valid id', async () => {
    const response = await request(app).get('/api/block/1');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(singleBlock);
  });

  it('should return 404 for a block with invalid id', async () => {
    dbStub.resolves(null);
    const response = await request(app).get('/api/block/1000');
    expect(response.status).to.equal(404);
  });

  after(() => {
    dbStub.restore();
  });

});

describe('GET /api/blocks', () => {
  
  before(() => {
    dbStub = sinon.stub(mongoose.Model, 'find');
    dbStub.resolves(multipleBlocks);
  });

  it('should return all blocks', async () => {
    const response = await request(app).get('/api/blocks');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(multipleBlocks);
  });

  it('should return all blocks with pagination', async () => {
    const response = await request(app).get('/api/blocks?page=1&limit=2');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(multipleBlocks);
  });
  
  it('should return 400 for invalid page or limit', async () => {
    const response = await request(app).get('/api/blocks?page=a&limit=-1');
    expect(response.status).to.equal(400);
  });


  after(() => {
    dbStub.restore();
  });

});