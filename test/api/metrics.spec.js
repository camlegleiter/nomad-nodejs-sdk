const nock = require('nock');

const Nomad = require('../../src');

describe('Nomad.Metrics', () => {
  let Format;

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    Format = 'prometheus';

    client = new Nomad.Metrics();
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

  describe('#getMetrics', () => {
    const metrics = { Counters: [], Gauges: [], Samples: [] };

    it('makes a GET call to the /metrics endpoint', async () => {
      nock(/localhost/).get('/v1/metrics').query((qs) => {
        expect(qs).not.toHaveProperty('format');
        return true;
      }).reply(200, metrics);

      const [, body] = await client.getMetrics();
      expect(body).toEqual(metrics);
    });

    it('optionally sets the response format', async () => {
      nock(/localhost/).get('/v1/metrics').query((qs) => {
        expect(qs).toHaveProperty('format', Format);
        return true;
      }).reply(200, metrics);

      const [, body] = await client.getMetrics({ Format });
      expect(body).toEqual(metrics);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/metrics').reply(200, metrics);

      client.getMetrics((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(metrics);
        done();
      });
    });
  });
});
