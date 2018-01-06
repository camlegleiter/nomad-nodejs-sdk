import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Validate', () => {
  const validation = { Warnings: '', Error: '' };

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

  describe('#validateJob', () => {
    const Job = {};

    beforeEach(() => {
      client = new Nomad.Validate();
    });

    it('makes a POST call to the /validate/job endpoint', () => {
      nock(/localhost/).post('/v1/validate/job').reply(200, validation);

      return expect(client.validateJob({ Job })).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/validate/job');
        expect(body).to.deep.equal(validation);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).post('/v1/validate/job').reply(200, validation);

      return client.validateJob({ Job }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/validate/job').reply(200, validation);

      client.validateJob({ Job }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/validate/job');
        expect(body).to.deep.equal(validation);

        done();
      });
    });
  });
});
