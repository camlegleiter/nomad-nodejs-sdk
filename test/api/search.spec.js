import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Search', () => {
  const Context = 'context';
  const Prefix = 'prefix';

  let client;

  before(() => {
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

  after(() => {
    nock.enableNetConnect();
  });

  describe('#search', () => {
    const search = { Matches: {}, Truncations: {} };

    it('makes a POST call to the /search endpoint', () => {
      nock(/localhost/).post('/v1/search').reply(200, (uri, body) => {
        expect(body).to.deep.equal({ Prefix, Context });

        return search;
      });

      return expect(client.search({ Prefix, Context })).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/search');

        expect(body).to.deep.equal(search);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).post('/v1/search').reply(200, search);

      return client.search({ Prefix, Context }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/search').reply(200, search);

      client.search({ Prefix, Context }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/search');
        expect(body).to.deep.equal(search);

        done();
      });
    });
  });
});
