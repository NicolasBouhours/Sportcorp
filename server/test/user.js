//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

User.remove({}, (err) => {
});
//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
      done()
    });
/*
  * Test the /GET route
  */
  describe('/POST signup', () => {
      it('it should RETURN token', (done) => {
        let user = {
        	email: "martin52@example.com",
        	password: "mart52",
        	passwordConfirm: "mart52",
        	firstname: "Martin",
        	lastname: "Dazin",
        	phone: "0636366363",
        	job: "Developper"
        }
        chai.request(server)
            .post('/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                process.env.token = res.body.token
              done();
            });
      });
  });

  describe('/POST signup same user', () => {
      it('it should RETURN error', (done) => {
        let user = {
          email: "martin52@example.com",
          password: "mart52",
          passwordConfirm: "mart52",
          firstname: "Martin",
          lastname: "Dazin",
          phone: "0636366363",
          job: "Developper"
        }
        chai.request(server)
            .post('/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('Email is in use');
              done();
            });
      });
  });

  describe('/POST signin bad credentials', () => {
    it('it should return error', (done) => {
      let user = {
        email: "martin52@example.com",
        password: "mart51"
      }
      chai.request(server)
          .post('/signin')
          .send(user)
          .end((err, res) => {
              res.should.have.status(401);
            done();
          });
    });
  });

  describe('/POST signin good credentials', () => {
    it('it should return success', (done) => {
      let user = {
        email: "martin52@example.com",
        password: "mart52"
      }
      chai.request(server)
          .post('/signin')
          .send(user)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('token');
              process.env.token = res.body.token
              process.env.userId = res.body.id
            done();
          });
    });
  });

  describe('/PUT update user with bad credentials', () => {
    it('it should return error', (done) => {
      let user = {
        lastname: "Dazin",
        phone: "0636366363",
        job:"Developper"
      }
      chai.request(server)
          .put(`/user`)
          .set('authorization', process.env.token)
          .send(user)
          .end((err, res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('error');
            done();
          });
    });
  });

  describe('/PUT update user with good credentials', () => {
    it('it should return success', (done) => {
      let user = {
        firstname: "Martin",
        lastname: "Dazin",
        phone: "0636366363",
        job:"Developper"
      }
      chai.request(server)
          .put(`/user`)
          .set('authorization', process.env.token)
          .send(user)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('success');
            done();
          });
    });
  });

  describe('/PUT update password with incorrect password', () => {
    it('it should return error', (done) => {
      let user = {
        password: "martindu65",
        passwordConfirm: "martindu64"
      }
      chai.request(server)
          .put(`/user/password`)
          .set('authorization', process.env.token)
          .send(user)
          .end((err, res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('error');
            done();
          });
    });
  });

  describe('/PUT update user with incorrect password', () => {
    it('it should return success', (done) => {
      let user = {
        password: "martindu65",
        passwordConfirm: "martindu65"
      }
      chai.request(server)
          .put(`/user/password`)
          .set('authorization', process.env.token)
          .send(user)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('success');
            done();
          });
    });
  });

});
