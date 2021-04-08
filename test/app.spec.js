const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "To Do List App Server Running"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'To Do List App Server Running')
  })
})