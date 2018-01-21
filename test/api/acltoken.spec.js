import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.ACLToken', () => {
  let AccessorID;
  let Name;
  let Type;
  let Policies;
  let Global;
  let token;
  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    token = {
      AccessorID: 'b780e702-98ce-521f-2e5f-c6b87de05b24',
      SecretID: '3f4a0fcd-7c42-773c-25db-2d31ba0c05fe',
      Name: 'Bootstrap Token',
      Type: 'management',
      Policies: null,
      Global: true,
      CreateTime: '2017-08-23T22:47:14.695408057Z',
      CreateIndex: 7,
      ModifyIndex: 7,
    };
    ({ AccessorID, Name, Type, Policies, Global } = token);

    client = new Nomad.ACLToken();
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

  describe('#bootstrapToken', () => {
    it('makes a POST call to the /acl/bootstrap endpoint', async () => {
      nock(/localhost/).post('/v1/acl/bootstrap').reply(200, token);

      const [, body] = await client.bootstrapToken();
      expect(body).toEqual(token);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/acl/bootstrap').reply(200, token);

      client.bootstrapToken((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(token);
        done();
      });
    });
  });

  describe('#listTokens', () => {
    it('makes a GET call to the /acl/tokens endpoint', async () => {
      nock(/localhost/).get('/v1/acl/tokens').reply(200, [token]);

      const [, body] = await client.listTokens();
      expect(body).toEqual([token]);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/acl/tokens').reply(200, [token]);

      client.listTokens((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual([token]);
        done();
      });
    });
  });

  describe('#createToken', () => {
    it('makes a POST call to the /acl/tokens endpoint', async () => {
      nock(/localhost/).post('/v1/acl/tokens').reply(200, token);

      const [, body] = await client.createToken({ Name, Type, Policies, Global });
      expect(body).toEqual(token);
    });

    it('allows for an optional Name', async () => {
      Name = undefined;
      token.Name = '';

      nock(/localhost/).post('/v1/acl/tokens').reply(200, (uri, body) => {
        expect(body).toEqual({ Type, Policies, Global });

        return token;
      });

      const [, body] = await client.createToken({ Name, Type, Policies, Global });
      expect(body).toEqual(token);
    });

    it('allows for the ACL token to optionally be made global', async () => {
      Global = undefined;
      token.Global = false;

      nock(/localhost/).post('/v1/acl/tokens').reply(200, (uri, body) => {
        expect(body).toEqual({ Name, Type, Policies });

        return token;
      });

      const [, body] = await client.createToken({ Name, Type, Policies, Global });
      expect(body).toEqual(token);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/acl/tokens').reply(200, token);

      client.createToken({ Name, Type, Policies, Global }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(token);
        done();
      });
    });
  });

  describe('#updateToken', () => {
    it('makes a POST call to the /acl/token/:AccessorID endpoint', async () => {
      nock(/localhost/).post(`/v1/acl/token/${AccessorID}`).reply(200, token);

      const [, body] = await client.updateToken({ AccessorID, Name, Type, Policies });
      expect(body).toEqual(token);
    });

    it('allows for an optional Name update', async () => {
      Name = undefined;
      token.Name = '';

      nock(/localhost/).post(`/v1/acl/token/${AccessorID}`).reply(200, (uri, body) => {
        expect(body).toEqual({ AccessorID, Type, Policies });

        return token;
      });

      const [, body] = await client.updateToken({ AccessorID, Name, Type, Policies });
      expect(body).toEqual(token);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/acl/token/${AccessorID}`).reply(200, token);

      client.updateToken({ AccessorID, Name, Type, Policies }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(token);
        done();
      });
    });
  });

  describe('#readToken', () => {
    it('makes a GET call to the /acl/token endpoint', async () => {
      nock(/localhost/).get(`/v1/acl/token/${AccessorID}`).reply(200, token);

      const [, body] = await client.readToken({ AccessorID });
      expect(body).toEqual(token);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/acl/token/${AccessorID}`).reply(200, token);

      client.readToken({ AccessorID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(token);
        done();
      });
    });
  });

  describe('#readSelfToken', () => {
    it('makes a GET call to the /acl/token/self endpoint', async () => {
      nock(/localhost/).get('/v1/acl/token/self').reply(200, token);

      const [, body] = await client.readSelfToken();
      expect(body).toEqual(token);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/acl/token/self').reply(200, token);

      client.readSelfToken((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(token);
        done();
      });
    });
  });

  describe('#deleteToken', () => {
    it('makes a DELETE call to the /acl/token endpoint', async () => {
      nock(/localhost/).delete(`/v1/acl/token/${AccessorID}`).reply(200);

      const [, body] = await client.deleteToken({ AccessorID });
      expect(body).toBeUndefined();
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete(`/v1/acl/token/${AccessorID}`).reply(200);

      client.deleteToken({ AccessorID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toBeUndefined();
        done();
      });
    });
  });
});
