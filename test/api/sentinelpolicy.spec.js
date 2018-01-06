import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.SentinelPolicy', () => {
  const Name = 'name';
  const Scope = 'scope';
  const EnforcementLevel = 'enforcementLevel';
  const Policy = 'policy';

  let Description;
  let validPolicy;

  before(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    Description = 'description';
    validPolicy = { Name, Description, Scope, EnforcementLevel };
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
    let client;

    beforeEach(() => {
      client = new Nomad.SentinelPolicy();
    });

    it('makes a GET call to the /sentinel/policies endpoint', () => {
      nock(/localhost/).get('/v1/sentinel/policies').reply(200, [validPolicy]);

      return expect(client.listPolicies()).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/sentinel/policies');

        expect(body).to.deep.equal([validPolicy]);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get('/v1/sentinel/policies').reply(200, [validPolicy]);

      return client.listPolicies().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/sentinel/policies').reply(200, [validPolicy]);

      client.listPolicies((err, [res, body]) => {
        if (err) {
          return done(err);
        }

        expect(res.req.path).to.equal('/v1/sentinel/policies');

        expect(body).to.deep.equal([validPolicy]);
        return done();
      });
    });
  });

  describe('#upsertPolicy', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.SentinelPolicy();
    });

    it('makes a POST call to the /sentinel/policy/:name endpoint', () => {
      nock(/localhost/).post(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      return expect(client.upsertPolicy({
        Name, Description, Scope, EnforcementLevel, Policy,
      })).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal(`/v1/sentinel/policy/${Name}`);

        expect(body).to.deep.equal(validPolicy);
      });
    });

    it('allows for an optional description', () => {
      Description = '';
      delete validPolicy.Description;

      nock(/localhost/).post(`/v1/sentinel/policy/${Name}`).reply(200, (uri, body) => {
        expect(body).to.deep.equal({ Name, Scope, EnforcementLevel, Policy });

        return validPolicy;
      });

      return expect(client.upsertPolicy({
        Name, Description, Scope, EnforcementLevel, Policy,
      })).to.eventually.be.fulfilled.then(([, body]) => {
        expect(body).to.deep.equal({ Name, Scope, EnforcementLevel });
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).post(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      return client.upsertPolicy({
        Name, Description, Scope, EnforcementLevel, Policy,
      }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      client.upsertPolicy({
        Name, Description, Scope, EnforcementLevel, Policy,
      }, (err, [res, body]) => {
        if (err) {
          return done(err);
        }

        expect(res.req.path).to.equal(`/v1/sentinel/policy/${Name}`);

        expect(body).to.deep.equal(validPolicy);
        return done();
      });
    });
  });

  describe('#readPolicy', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.SentinelPolicy();
    });

    it('makes a GET call to the /sentinel/policy/:name endpoint', () => {
      nock(/localhost/).get(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      return expect(client.readPolicy({ Name })).to.eventually.be.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal(`/v1/sentinel/policy/${Name}`);

        expect(body).to.deep.equal(validPolicy);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      return client.readPolicy({ Name }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      client.readPolicy({ Name }, (err, [res, body]) => {
        if (err) {
          return done(err);
        }

        expect(res.req.path).to.equal(`/v1/sentinel/policy/${Name}`);

        expect(body).to.deep.equal(validPolicy);
        return done();
      });
    });
  });

  describe('#deletePolicy', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.SentinelPolicy();
    });

    it('makes a DELETE call to the /sentinel/policy/:name endpoint', () => {
      nock(/localhost/).delete(`/v1/sentinel/policy/${Name}`).reply(200);

      return expect(client.deletePolicy({ Name })).to.eventually.be.fulfilled.then(([res]) => {
        expect(res.req.path).to.equal(`/v1/sentinel/policy/${Name}`);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).delete(`/v1/sentinel/policy/${Name}`).reply(200);

      return client.deletePolicy({ Name }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete(`/v1/sentinel/policy/${Name}`).reply(200);

      client.deletePolicy({ Name }, (err, [res]) => {
        if (err) {
          return done(err);
        }

        expect(res.req.path).to.equal(`/v1/sentinel/policy/${Name}`);
        return done();
      });
    });
  });
});
