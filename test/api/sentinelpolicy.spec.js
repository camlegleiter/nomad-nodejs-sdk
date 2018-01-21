import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.SentinelPolicy', () => {
  const Name = 'name';
  const Scope = 'scope';
  const EnforcementLevel = 'enforcementLevel';
  const Policy = 'policy';

  let Description;
  let validPolicy;

  beforeAll(() => {
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

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('#listPolicies', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.SentinelPolicy();
    });

    it('makes a GET call to the /sentinel/policies endpoint', async () => {
      nock(/localhost/).get('/v1/sentinel/policies').reply(200, [validPolicy]);

      const [, body] = await client.listPolicies();
      expect(body).toEqual([validPolicy]);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/sentinel/policies').reply(200, [validPolicy]);

      client.listPolicies((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual([validPolicy]);
        done();
      });
    });
  });

  describe('#upsertPolicy', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.SentinelPolicy();
    });

    it('makes a POST call to the /sentinel/policy/:name endpoint', async () => {
      nock(/localhost/).post(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      const [, body] = await client.upsertPolicy({
        Name, Description, Scope, EnforcementLevel, Policy,
      });

      expect(body).toEqual(validPolicy);
    });

    it('allows for an optional description', async () => {
      Description = '';
      delete validPolicy.Description;

      nock(/localhost/).post(`/v1/sentinel/policy/${Name}`).reply(200, (uri, body) => {
        expect(body).toEqual({ Name, Scope, EnforcementLevel, Policy });

        return validPolicy;
      });

      const [, body] = await client.upsertPolicy({
        Name, Description, Scope, EnforcementLevel, Policy,
      });
      expect(body).toEqual({ Name, Scope, EnforcementLevel });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      client.upsertPolicy({
        Name, Description, Scope, EnforcementLevel, Policy,
      }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(validPolicy);
        done();
      });
    });
  });

  describe('#readPolicy', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.SentinelPolicy();
    });

    it('makes a GET call to the /sentinel/policy/:name endpoint', async () => {
      nock(/localhost/).get(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      const [, body] = await client.readPolicy({ Name });
      expect(body).toEqual(validPolicy);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/sentinel/policy/${Name}`).reply(200, validPolicy);

      client.readPolicy({ Name }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(validPolicy);
        done();
      });
    });
  });

  describe('#deletePolicy', () => {
    let client;

    beforeEach(() => {
      client = new Nomad.SentinelPolicy();
    });

    it('makes a DELETE call to the /sentinel/policy/:name endpoint', async () => {
      nock(/localhost/).delete(`/v1/sentinel/policy/${Name}`).reply(200);

      const [, body] = await client.deletePolicy({ Name });
      expect(body).toBeUndefined();
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete(`/v1/sentinel/policy/${Name}`).reply(200);

      client.deletePolicy({ Name }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toBeUndefined();
        done();
      });
    });
  });
});
