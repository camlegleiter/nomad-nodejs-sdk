const nock = require('nock');

const Nomad = require('../../src');

describe('Nomad.Namespace', () => {
  let Namespace;
  let Description;
  let Prefix;

  let client;
  let namespace;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    Namespace = 'api-prod';
    Description = 'Production API Servers';
    Prefix = 'prod';

    namespace = {
      Description,
      Name: Namespace,
      CreateIndex: 31,
      ModifyIndex: 31,
    };

    client = new Nomad.Namespace();
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

  describe('#listNamespaces', () => {
    let namespaces;

    beforeEach(() => {
      namespaces = [namespace];
    });

    it('makes a GET call to the /namespaces endpoint', async () => {
      nock(/localhost/).get('/v1/namespaces').reply(200, namespaces);

      const [, body] = await client.listNamespaces();
      expect(body).toEqual(namespaces);
    });

    it('allows for a prefix to be set', async () => {
      nock(/localhost/).get('/v1/namespaces').query({
        prefix: Prefix,
      }).reply(200, namespaces);

      const [, body] = await client.listNamespaces({ Prefix });
      expect(body).toEqual(namespaces);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/namespaces').reply(200, namespaces);

      client.listNamespaces((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(namespaces);
        done();
      });
    });
  });

  describe('#readNamespace', () => {
    it('makes a GET call to the /namespace/:namespace endpoint', async () => {
      nock(/localhost/).get(`/v1/namespace/${Namespace}`).reply(200, namespace);

      const [, body] = await client.readNamespace({ Namespace });
      expect(body).toEqual(namespace);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/namespace/${Namespace}`).reply(200, namespace);

      client.readNamespace({ Namespace }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(namespace);
        done();
      });
    });
  });

  describe('#createNamespace', () => {
    it('makes a POST call to the /namespace endpoint', async () => {
      nock(/localhost/).post('/v1/namespace').reply(200, namespace);

      const [, body] = await client.createNamespace({ Namespace });
      expect(body).toEqual(namespace);
    });

    it('allows for an optional description', async () => {
      nock(/localhost/).post('/v1/namespace').reply(200, (uri, requestBody) => {
        expect(requestBody).toHaveProperty('Description', Description);
        return namespace;
      });

      const [, body] = await client.createNamespace({ Namespace, Description });
      expect(body).toEqual(namespace);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/namespace').reply(200, namespace);

      client.createNamespace({ Namespace }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(namespace);
        done();
      });
    });
  });

  describe('#updateNamespace', () => {
    it('makes a POST call to the /namespace endpoint', async () => {
      nock(/localhost/).post(`/v1/namespace/${Namespace}`).reply(200, namespace);

      const [, body] = await client.updateNamespace({ Namespace });
      expect(body).toEqual(namespace);
    });

    it('allows for an optional description', async () => {
      nock(/localhost/).post(`/v1/namespace/${Namespace}`).reply(200, (_, requestBody) => {
        expect(requestBody).toHaveProperty('Description', Description);
        return namespace;
      });

      const [, body] = await client.updateNamespace({ Namespace, Description });
      expect(body).toEqual(namespace);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/namespace/${Namespace}`).reply(200, namespace);

      client.updateNamespace({ Namespace }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(namespace);
        done();
      });
    });
  });

  describe('#deleteNamespace', () => {
    it('makes a DELETE call to the /namespace endpoint', async () => {
      nock(/localhost/).delete(`/v1/namespace/${Namespace}`).reply(200);

      const [, body] = await client.deleteNamespace({ Namespace });
      expect(body).toBeUndefined();
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete(`/v1/namespace/${Namespace}`).reply(200);

      client.deleteNamespace({ Namespace }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toBeUndefined();
        done();
      });
    });
  });
});
