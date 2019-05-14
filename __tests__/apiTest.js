const request = require('supertest');
const app = require('./../server/app.js');

/*
Testing for endpoints
*/

describe('GET /api/business', () => {
  it('respond with "Hello, World"', (done) => {
    request(app)
      .get('/api/business')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});
