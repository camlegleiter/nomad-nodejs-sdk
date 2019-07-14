const nock = require('nock');

const Nomad = require('../../src');

describe('Nomad.Status', () => {
  const leader = '127.0.0.1:4646';
  const peers = [leader];

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    const pendingMocks = nock.pendingMocks();
    if (pendingMocks.length) {
      throw new Error(`Pending mocks still around: ${pendingMocks}`);
    }
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('#readLeader', () => {
    beforeEach(() => {
      client = new Nomad.Status();
    });

    it('makes a GET call to the /status/leader endpoint', async () => {
      nock(/localhost/).get('/v1/status/leader').reply(200, leader);

      const [, body] = await client.readLeader();
      expect(body).toEqual(leader);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/status/leader').reply(200, leader);

      client.readLeader((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(leader);
        done();
      });
    });
  });

  describe('#listPeers', () => {
    beforeEach(() => {
      client = new Nomad.Status();
    });

    it('makes a GET call to the /status/peers endpoint', async () => {
      nock(/localhost/).get('/v1/status/peers').reply(200, peers);

      const [, body] = await client.listPeers();
      expect(body).toEqual(peers);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/status/peers').reply(200, peers);

      client.listPeers((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(peers);
        done();
      });
    });
  });
});
