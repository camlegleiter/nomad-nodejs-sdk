import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Search', () => {
  const Context = 'context';
  const Prefix = 'prefix';

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    client = new Nomad.Search();
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

  describe('#search', () => {
    const search = { Matches: {}, Truncations: {} };

    it('makes a POST call to the /search endpoint', async () => {
      nock(/localhost/).post('/v1/search').reply(200, (uri, body) => {
        expect(body).toEqual({ Prefix, Context });

        return search;
      });

      const [, body] = await client.search({ Prefix, Context });
      expect(body).toEqual(search);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/search').reply(200, search);

      client.search({ Prefix, Context }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(search);
        done();
      });
    });
  });
});
