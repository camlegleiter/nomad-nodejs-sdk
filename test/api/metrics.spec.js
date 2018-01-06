import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Metrics', () => {
  let Format;

  let client;

  before(() => {
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

  after(() => {
    nock.enableNetConnect();
  });

  describe('#getMetrics', () => {
    const metrics = { Counters: [], Gauges: [], Samples: [] };

    it('makes a GET call to the /metrics endpoint', () => {
      nock(/localhost/).get('/v1/metrics').query((qs) => {
        expect(qs).to.not.have.property('format');
        return true;
      }).reply(200, metrics);

      return expect(client.getMetrics()).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/metrics');

        expect(body).to.deep.equal(metrics);
      });
    });

    it('optionally sets the response format', () => {
      nock(/localhost/).get('/v1/metrics').query((qs) => {
        expect(qs).to.have.property('format', Format);
        return true;
      }).reply(200, metrics);

      return expect(client.getMetrics({ Format })).eventually.fulfilled.then(([, body]) => {
        expect(body).to.deep.equal(metrics);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get('/v1/metrics').reply(200, metrics);

      return client.getMetrics().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/metrics').reply(200, metrics);

      client.getMetrics((err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/metrics');
        expect(body).to.deep.equal(metrics);

        done();
      });
    });
  });
});
