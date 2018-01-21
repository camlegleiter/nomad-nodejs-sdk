import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Region', () => {
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

  describe('#listRegions', () => {
    const regions = ['region1', 'region2'];

    let client;

    beforeEach(() => {
      client = new Nomad.Region();
    });

    it('makes a GET call to the /status/regions endpoint', async () => {
      nock(/localhost/).get('/v1/status/regions').reply(200, regions);

      const [, body] = await client.listRegions();
      expect(body).toEqual(regions);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/status/regions').reply(200, regions);

      client.listRegions((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(regions);
        done();
      });
    });
  });
});
