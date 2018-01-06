import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Region', () => {
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

  describe('#listRegions', () => {
    const regions = ['region1', 'region2'];

    let client;

    beforeEach(() => {
      client = new Nomad.Region();
    });

    it('makes a GET call to the /status/regions endpoint', () => {
      nock(/localhost/).get('/v1/status/regions').reply(200, regions);

      return expect(client.listRegions()).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/status/regions');

        expect(body).to.deep.equal(regions);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get('/v1/status/regions').reply(200, regions);

      return client.listRegions().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/status/regions').reply(200, regions);

      client.listRegions((err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/status/regions');
        expect(body).to.deep.equal(regions);

        done();
      });
    });
  });
});
