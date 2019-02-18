const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mock = require('mock-fs');
const server = require('../index');

const metricStore = require('../lib/metricStore');
const { TIMES } = require('../lib/constants');

const today = new Date();
const twoHoursAgo = new Date(today.getTime() - TIMES.ONE_HOUR*2).getTime();

chai.use(chaiHttp);

describe('/GET metric', () => {
  it('returns the sum for a metric with entries', done => {
    metricStore['page_visits'] = []
    metricStore['page_visits'].push({
      value: 150,
      created: twoHoursAgo
    });
    metricStore['page_visits'].push({
      value: 301,
      created: Date.now()
    });

    chai.request(server)
      .get('/metric/page_visits/sum')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.value.should.be.eql(301);
        done();
      });
  });

  it('returns 0 for a metric with no entries', done => {
    metricStore['page_visits'] = []

    chai.request(server)
      .get('/metric/page_visits/sum')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.value.should.be.eql(0);
        done();
      });
  });

  it('returns 400 for a missing metric', done => {
    chai.request(server)
      .get('/metric/foo/sum')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.error.should.be.eql('Metric foo not found');
        done();
      });
  });
});

describe('/POST metric', () => {
  it('returns 200 for a new metric', done => {
    chai.request(server)
      .post('/metric/page_visits')
      .send({ value: 100 })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('returns 400 for an invalid value', done => {
    chai.request(server)
      .post('/metric/page_visits')
      .send({ value: 'my val' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.error.should.be.eql('Metric value is invalid or undefined');
        done();
      });
  });

  it('returns 400 for a missing value', done => {
    chai.request(server)
      .post('/metric/page_visits')
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.error.should.be.eql('Metric value is invalid or undefined');
        done();
      });
  });
});
