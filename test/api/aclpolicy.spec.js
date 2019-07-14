const nock = require('nock');

const Nomad = require('../../src');

describe('Nomad.ACLPolicy', () => {
  const Name = 'name';
  const Description = 'description';
  const Rules = 'rules';

  let client;
  let validPolicy;

  beforeAll(() => {
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

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('#listPolicies', () => {
    beforeEach(() => {
      client = new Nomad.ACLPolicy();
    });

    it('makes a GET call to the /acl/policies endpoint', async () => {
      nock(/localhost/).get('/v1/acl/policies').reply(200, [validPolicy]);

      const [, body] = await client.listPolicies();
      expect(body).toEqual([validPolicy]);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/acl/policies').reply(200, [validPolicy]);

      client.listPolicies((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual([validPolicy]);
        done();
      });
    });
  });

  describe('#upsertPolicy', () => {
    beforeEach(() => {
      client = new Nomad.ACLPolicy();
    });

    it('makes a POST call to the /acl/policy/:name endpoint', async () => {
      nock(/localhost/).post(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      const [, body] = await client.upsertPolicy({ Name, Description, Rules });
      expect(body).toEqual(validPolicy);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      client.upsertPolicy({ Name, Description, Rules }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(validPolicy);
        done();
      });
    });
  });

  describe('#readPolicy', () => {
    beforeEach(() => {
      client = new Nomad.ACLPolicy();
    });

    it('makes a GET call to the /acl/policy/:name endpoint', async () => {
      nock(/localhost/).get(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      const [, body] = await client.readPolicy({ Name });
      expect(body).toEqual(validPolicy);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/acl/policy/${Name}`).reply(200, validPolicy);

      client.readPolicy({ Name }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(validPolicy);
        done();
      });
    });
  });

  describe('#deletePolicy', () => {
    beforeEach(() => {
      client = new Nomad.ACLPolicy();
    });

    it('makes a DELETE call to the /acl/policy/:name endpoint', async () => {
      nock(/localhost/).delete(`/v1/acl/policy/${Name}`).reply(200);

      const [, body] = await client.deletePolicy({ Name });
      expect(body).toBeUndefined();
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete(`/v1/acl/policy/${Name}`).reply(200);

      client.deletePolicy({ Name }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toBeUndefined();
        done();
      });
    });
  });
});
