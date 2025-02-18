import request from 'supertest';
import * as chai from 'chai';
import { describe, it } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';

describe('GET /api/alive', () => {
  it('should return { alive: true }', async () => {
    const response = await request(app).get('/api/alive');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ alive: true });
  });
});
