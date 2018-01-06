import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Status', () => {
  const leader = '127.0.0.1:4646';
  const peers = [leader];

  let client;

  before(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    const pendingMocks = nock.pendingMocks();
    if (pendingMocks.length) {
      throw new Error(`Pending mocks still around: ${pendingMocks}`);
    }
    nock.cleanAll();
  });

  after(() => {
    nock.enableNetConnect();
  });

  describe('#readLeader', () => {
    beforeEach(() => {
      client = new Nomad.Status();
    });

    it('makes a GET call to the /status/leader endpoint', () => {
      nock(/localhost/).get('/v1/status/leader').reply(200, leader);

      return expect(client.readLeader()).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/status/leader');
        expect(body).to.deep.equal(leader);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get('/v1/status/leader').reply(200, leader);

      return client.readLeader().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/status/leader').reply(200, leader);

      client.readLeader((err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/status/leader');
        expect(body).to.deep.equal(leader);

        done();
      });
    });
  });

  describe('#listPeers', () => {
    beforeEach(() => {
      client = new Nomad.Status();
    });

    it('makes a GET call to the /status/peers endpoint', () => {
      nock(/localhost/).get('/v1/status/peers').reply(200, peers);

      return expect(client.listPeers()).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/status/peers');
        expect(body).to.deep.equal(peers);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get('/v1/status/peers').reply(200, peers);

      return client.listPeers().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/status/peers').reply(200, peers);

      client.listPeers((err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/status/peers');
        expect(body).to.deep.equal(peers);

        done();
      });
    });
  });
});
