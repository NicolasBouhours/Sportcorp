const Q = require('q')

exports.test = (chai, server, should) => {

  defer = Q.defer()
  let teamId = 0

  //Our parent block
  describe('Teams', () => {
      beforeEach((done) => { //Before each test we empty the database
        done()
      });

    describe('/POST create team', () => {
        it('it should return success', (done) => {
          let team = {
          	name: "Ghetto a susu",
          	description: "La description du ghetto"
          }
          chai.request(server)
              .post('/team')
              .set('authorization', process.env.token)
              .send(team)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('success');
                  defer.resolve()
                  done();
              });
        });
    });

    describe('/POST create team with bad info', () => {
        it('it should return error', (done) => {
          let team = {
            description: "La description du ghetto"
          }
          chai.request(server)
              .post('/team')
              .set('authorization', process.env.token)
              .send(team)
              .end((err, res) => {
                  res.should.have.status(422);
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
                  defer.resolve()
                  done();
              });
        });
    });

    describe('/GET team for user', () => {
        it('it should return table team of 1', (done) => {
          chai.request(server)
              .get('/team/user')
              .set('authorization', process.env.token)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('teams');
                  res.body.teams.should.have.length(1);
                  res.body.teams[0].should.have.property('_id')
                  res.body.teams[0].should.have.property('name').eql('Ghetto a susu')
                  res.body.teams[0].should.have.property('description').eql('La description du ghetto')
                  teamId = res.body.teams[0]._id
                  defer.resolve()
                  done();
              });
        });
    });

    describe('/GET team', () => {
        it('it should return a team', (done) => {
          chai.request(server)
              .get(`/team/${teamId}`)
              .set('authorization', process.env.token)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('team');
                  res.body.team.should.have.property('_id')
                  res.body.team.should.have.property('name').eql('Ghetto a susu')
                  res.body.team.should.have.property('description').eql('La description du ghetto')
                  defer.resolve()
                  done();
              });
        });
    });

    describe('/PUT team', () => {
        it('it should return success', (done) => {
          let team = {
          	name: "Le Ghetto a susu",
          	description: "La description du ghetto a susu"
          }
          chai.request(server)
              .put(`/team/${teamId}`)
              .set('authorization', process.env.token)
              .send(team)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('success');
                  defer.resolve()
                  done();
              });
        });
    });

    describe('/PUT team with bad info', () => {
        it('it should return error', (done) => {
          let team = {
          	description: "La description du ghetto a susu"
          }
          chai.request(server)
              .put(`/team/${teamId}`)
              .set('authorization', process.env.token)
              .send(team)
              .end((err, res) => {
                  res.should.have.status(422);
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
                  defer.resolve()
                  done();
              });
        });
    });

    describe('/DELETE team', () => {
        it('it should return success', (done) => {

          let idAddTeam = 0;

          let team = {
            name: "Ghetto a susu",
            description: "La description du ghetto"
          }

          chai.request(server)
              .post('/team')
              .set('authorization', process.env.token)
              .send(team)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('success');
                  idAddTeam = res.body.team._id

                  chai.request(idAddTeam)
                      .del(`/team/${idAddTeam}`)
                      .set('authorization', process.env.token)
                      .send(team)
                      .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('object');
                          res.body.should.have.property('success');
                          defer.resolve()
                          done();
                      });

                  defer.resolve()
                  done();
              });
        });
    });

  });

  return defer.promise;
}
