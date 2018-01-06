import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.ACLPolicy', () => {
  const Name = 'name';
  const Description = 'description';
  const Rules = 'rules';

  let client;
  let validPolicy;

  before(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    validPolicy = { Name, Description, Rules };
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

  describe('#listPolicies', () => {
    beforeEach(() => {
      client = new Nomad.ACLPolicy();
    });

    it('makes a GET call to the /acl/policies endpoint', () => {
      nock(/localhost/).get('/v1/acl/policies').reply(200, [validPolicy]);

      return expect(client.listPolicies()).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/acl/policies');

        expect(body).to.deep.equal([validPolicy]);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get('/v1/acl/policies').reply(200, [validPolicy]);

      return expect(client.listPolicies()).to.eventually.be.fulfilled.then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/acl/policies').reply(200, [validPolicy]);

      client.listPolicies((err, [res]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/acl/policies');

        done();
      });
    });
  });

  describe('#upsertPolicy', () => {
    beforeEach(() => {
      client = new Nomad.ACLPolicy();
    });

    it('makes a POST call to the /acl/policy/:name endpoint', () => {
      nock(/localhost/).post(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      return expect(client.upsertPolicy({
        Name, Description, Rules,
      })).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal(`/v1/acl/policy/${Name}`);

        expect(body).to.deep.equal(validPolicy);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).post(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      return client.upsertPolicy({
        Name, Description, Rules,
      }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      client.upsertPolicy({ Name, Description, Rules }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal(`/v1/acl/policy/${Name}`);
        expect(body).to.deep.equal(validPolicy);

        done();
      });
    });
  });

  describe('#readPolicy', () => {
    beforeEach(() => {
      client = new Nomad.ACLPolicy();
    });

    it('makes a GET call to the /acl/policy/:name endpoint', () => {
      nock(/localhost/).get(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      return expect(client.readPolicy({ Name })).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal(`/v1/acl/policy/${Name}`);

        expect(body).to.deep.equal(validPolicy);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      return client.readPolicy({ Name }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      client.readPolicy({ Name }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal(`/v1/acl/policy/${Name}`);
        expect(body).to.deep.equal(validPolicy);

        done();
      });
    });
  });

  describe('#deletePolicy', () => {
    beforeEach(() => {
      client = new Nomad.ACLPolicy();
    });

    it('makes a DELETE call to the /acl/policy/:name endpoint', () => {
      nock(/localhost/).delete(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      return expect(client.deletePolicy({ Name })).to.eventually.be.fulfilled.then(([res]) => {
        expect(res.req.path).to.equal(`/v1/acl/policy/${Name}`);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).delete(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      return client.deletePolicy({ Name }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      client.deletePolicy({ Name }, (err, [res]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal(`/v1/acl/policy/${Name}`);

        done();
      });
    });
  });
});
