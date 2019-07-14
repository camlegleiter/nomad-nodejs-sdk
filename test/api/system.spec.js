const nock = require('nock');

const Nomad = require('../../src');

describe('Nomad.System', () => {
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

  describe('#forceGC', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.System();
    });

    it('makes a PUT call to the /system/gc endpoint', async () => {
      nock(/localhost/).put('/v1/system/gc').reply(200);

      const [, body] = await client.forceGC();
      expect(body).toBeUndefined();
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).put('/v1/system/gc').reply(200);

      client.forceGC((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toBeUndefined();
        done();
      });
    });
  });

  describe('#reconcileSummaries', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.System();
    });

    it('makes a PUT call to the /system/reconcile/summaries endpoint', async () => {
      nock(/localhost/).put('/v1/system/reconcile/summaries').reply(200);

      const [, body] = await client.reconcileSummaries();
      expect(body).toBeUndefined();
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).put('/v1/system/reconcile/summaries').reply(200);

      client.reconcileSummaries((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toBeUndefined();
        done();
      });
    });
  });
});
