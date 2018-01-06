import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.System', () => {
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

  describe('#forceGC', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.System();
    });

    it('makes a PUT call to the /system/gc endpoint', () => {
      nock(/localhost/).put('/v1/system/gc').reply(200);

      return expect(client.forceGC()).to.eventually.be.fulfilled.then(([res]) => {
        expect(res.req.path).to.equal('/v1/system/gc');
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).put('/v1/system/gc').reply(200);

      return client.forceGC().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).put('/v1/system/gc').reply(200);

      client.forceGC((err, [res]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/system/gc');

        done();
      });
    });
  });

  describe('#reconcileSummaries', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.System();
    });

    it('makes a PUT call to the /system/reconcile/summaries endpoint', () => {
      nock(/localhost/).put('/v1/system/reconcile/summaries').reply(200);

      return expect(client.reconcileSummaries()).to.eventually.be.fulfilled.then(([res]) => {
        expect(res.req.path).to.equal('/v1/system/reconcile/summaries');
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).put('/v1/system/reconcile/summaries').reply(200);

      return client.reconcileSummaries().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).put('/v1/system/reconcile/summaries').reply(200);

      client.reconcileSummaries((err, [res]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/system/reconcile/summaries');

        done();
      });
    });
  });
});
