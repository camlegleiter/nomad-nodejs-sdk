const nock = require('nock');

const Nomad = require('../../src');

describe('Nomad.Operator', () => {
  let Address;
  let Stale;

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    Address = '1.1.1.1:4646';
    Stale = true;

    client = new Nomad.Operator();
  });

  afterEach(() => {
    const pendingMocks = nock.pendingMocks();
    if (pendingMocks.length) {
      const mocks = pendingMocks.slice(0);
      nock.cleanAll();
      throw new Error(`Pending mocks still around: ${JSON.stringify(mocks)}`);
    }
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('#readRaftConfiguration', () => {
    let config;

    beforeEach(() => {
      config = {
        Id: 1,
        Servers: [],
      };
    });

    it('makes a GET call to the /operator/raft/configuration endpoint', async () => {
      nock(/localhost/).get('/v1/operator/raft/configuration').reply(200, config);

      const [, body] = await client.readRaftConfiguration({});
      expect(body).toEqual(config);
    });

    it('sets whether or not to return without an active leader', async () => {
      nock(/localhost/).get('/v1/operator/raft/configuration').query({
        stale: null,
      }).reply(200, config);

      const [, body] = await client.readRaftConfiguration({ Stale });
      expect(body).toEqual(config);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/operator/raft/configuration').reply(200, config);

      client.readRaftConfiguration((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(config);
        done();
      });
    });
  });

  describe('#removeRaftPeer', () => {
    let config;

    beforeEach(() => {
      config = {
        Id: 1,
        Servers: [],
      };
    });

    it('makes a DELETE call to the /operator/raft/peer endpoint', async () => {
      nock(/localhost/).delete('/v1/operator/raft/peer').query({
        address: Address,
      }).reply(200, config);

      const [, body] = await client.removeRaftPeer({ Address });
      expect(body).toEqual(config);
    });

    it('allows for multiple addresses to be specified', async () => {
      nock(/localhost/).delete('/v1/operator/raft/peer').query({
        address: [Address, Address],
      }).reply(200, config);

      const [, body] = await client.removeRaftPeer({ Address: [Address, Address] });
      expect(body).toEqual(config);
    });

    it('sets whether or not to return without an active leader', async () => {
      nock(/localhost/).delete('/v1/operator/raft/peer').query({
        address: Address,
        stale: null,
      }).reply(200, config);

      const [, body] = await client.removeRaftPeer({ Address, Stale });
      expect(body).toEqual(config);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete('/v1/operator/raft/peer').query({
        address: Address,
      }).reply(200, config);

      client.removeRaftPeer({ Address }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(config);
        done();
      });
    });
  });
});
