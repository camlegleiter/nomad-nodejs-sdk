const nock = require('nock');

const Nomad = require('../../src');

describe('Nomad.Quota', () => {
  let Name;
  let Prefix;

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    Name = 'shared-quota';
    Prefix = 'sha';

    client = new Nomad.Quota();
  });

  afterEach(() => {
    const pendingMocks = nock.pendingMocks();
    if (pendingMocks.length) {
      const mocks = pendingMocks.slice(0);
      nock.cleanAll();
      throw new Error(`Pending mocks still around: ${JSON.stringify(mocks)}`);
    }
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('#listQuotaSpecifications', () => {
    let quotas;

    beforeEach(() => {
      quotas = [
        {
          Name,
          CreateIndex: 0,
          Description: 'Limit the shared default namespace',
          Hash: 'SgDCH7L5ZDqNSi2NmJlqdvczt/Q6mjyVwVJC0XjWglQ=',
          Limits: [],
          ModifyIndex: 56,
        },
      ];
    });

    it('makes a GET call to the /quotas endpoint', async () => {
      nock(/localhost/).get('/v1/quotas').reply(200, quotas);

      const [, body] = await client.listQuotaSpecifications({});
      expect(body).toEqual(quotas);
    });

    it('defaults to no prefix if no value is provided', async () => {
      nock(/localhost/).get('/v1/quotas').reply(200, quotas);

      const [, body] = await client.listQuotaSpecifications();
      expect(body).toEqual(quotas);
    });

    it('sets the prefix to filter by', async () => {
      nock(/localhost/).get('/v1/quotas').query({
        prefix: Prefix,
      }).reply(200, () => quotas.filter((quota) => quota.Name.startsWith(Prefix)));

      const [, body] = await client.listQuotaSpecifications({ Prefix });
      expect(body).toEqual(quotas);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/quotas').reply(200, quotas);

      client.listQuotaSpecifications((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(quotas);
        done();
      });
    });
  });

  describe('#readQuotaSpecification', () => {
    let quota;

    beforeEach(() => {
      quota = {
        Name,
        CreateIndex: 0,
        Description: 'Limit the shared default namespace',
        Hash: 'SgDCH7L5ZDqNSi2NmJlqdvczt/Q6mjyVwVJC0XjWglQ=',
        Limits: [],
        ModifyIndex: 56,
      };
    });

    it('makes a GET call to the /quota/:name endpoint', async () => {
      nock(/localhost/).get(`/v1/quota/${Name}`).reply(200, quota);

      const [, body] = await client.readQuotaSpecification({ Name });
      expect(body).toEqual(quota);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/quota/${Name}`).reply(200, quota);

      client.readQuotaSpecification({ Name }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(quota);
        done();
      });
    });
  });

  describe('#createQuotaSpecification', () => {
    let Quota;

    beforeEach(() => {
      Quota = {
        Name,
        Description: 'Limit the shared default namespace',
        Limits: [],
      };
    });

    it('makes a POST call to the /quota endpoint', async () => {
      nock(/localhost/).post('/v1/quota').reply(200, Quota);

      const [, body] = await client.createQuotaSpecification({ Quota });
      expect(body).toEqual(Quota);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/quota').reply(200, Quota);

      client.createQuotaSpecification({ Quota }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(Quota);
        done();
      });
    });
  });

  describe('#updateQuotaSpecification', () => {
    let Quota;

    beforeEach(() => {
      Quota = {
        Name,
        Description: 'Limit the shared default namespace',
        Limits: [],
      };
    });

    it('makes a POST call to the /quota/:name endpoint', async () => {
      nock(/localhost/).post(`/v1/quota/${Name}`).reply(200, Quota);

      const [, body] = await client.updateQuotaSpecification({ Quota });
      expect(body).toEqual(Quota);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/quota/${Name}`).reply(200, Quota);

      client.updateQuotaSpecification({ Quota }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(Quota);
        done();
      });
    });
  });

  describe('#deleteQuotaSpecification', () => {
    it('makes a DELETE call to the /quota/:name endpoint', async () => {
      nock(/localhost/).delete(`/v1/quota/${Name}`).reply(200);

      const [, body] = await client.deleteQuotaSpecification({ Name });
      expect(body).toBeUndefined();
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete(`/v1/quota/${Name}`).reply(200);

      client.deleteQuotaSpecification({ Name }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toBeUndefined();
        done();
      });
    });
  });

  describe('#listQuotaUsages', () => {
    let usages;

    beforeEach(() => {
      usages = [
        {
          Name: 'shared-usage',
          CreateIndex: 8,
          ModifyIndex: 56,
          Used: {},
        },
      ];
    });

    it('makes a GET call to the /quota-usages endpoint', async () => {
      nock(/localhost/).get('/v1/quota-usages').reply(200, usages);

      const [, body] = await client.listQuotaUsages({});
      expect(body).toEqual(usages);
    });

    it('defaults to no prefix if no value is provided', async () => {
      nock(/localhost/).get('/v1/quota-usages').reply(200, usages);

      const [, body] = await client.listQuotaUsages();
      expect(body).toEqual(usages);
    });

    it('sets the prefix to filter by', async () => {
      nock(/localhost/).get('/v1/quota-usages').query({
        prefix: Prefix,
      }).reply(200, () => usages.filter((usage) => usage.Name.startsWith(Prefix)));

      const [, body] = await client.listQuotaUsages({ Prefix });
      expect(body).toEqual(usages);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/quota-usages').reply(200, usages);

      client.listQuotaUsages((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(usages);
        done();
      });
    });
  });

  describe('#readQuotaUsage', () => {
    let usage;

    beforeEach(() => {
      usage = {
        Name: 'shared-usage',
        CreateIndex: 8,
        ModifyIndex: 56,
        Used: {},
      };
    });

    it('makes a GET call to the /quota/usage/:name endpoint', async () => {
      nock(/localhost/).get(`/v1/quota/usage/${Name}`).reply(200, usage);

      const [, body] = await client.readQuotaUsage({ Name });
      expect(body).toEqual(usage);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/quota/usage/${Name}`).reply(200, usage);

      client.readQuotaUsage({ Name }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(usage);
        done();
      });
    });
  });
});
