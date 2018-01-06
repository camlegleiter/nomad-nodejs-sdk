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

  before(() => {
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

  after(() => {
    nock.enableNetConnect();
  });

  describe('#bootstrapToken', () => {
    it('makes a POST call to the /acl/bootstrap endpoint', () => {
      nock(/localhost/).post('/v1/acl/bootstrap').reply(200, token);

      return expect(client.bootstrapToken()).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/acl/bootstrap');

        expect(body).to.deep.equal(token);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).post('/v1/acl/bootstrap').reply(200, token);

      return client.bootstrapToken().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/acl/bootstrap').reply(200, token);

      client.bootstrapToken((err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/acl/bootstrap');
        expect(body).to.deep.equal(token);

        done();
      });
    });
  });

  describe('#listTokens', () => {
    it('makes a GET call to the /acl/tokens endpoint', () => {
      nock(/localhost/).get('/v1/acl/tokens').reply(200, [token]);

      return expect(client.listTokens()).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/acl/tokens');

        expect(body).to.deep.equal([token]);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get('/v1/acl/tokens').reply(200, [token]);

      return client.listTokens().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/acl/tokens').reply(200, [token]);

      client.listTokens((err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/acl/tokens');
        expect(body).to.deep.equal([token]);

        done();
      });
    });
  });

  describe('#createToken', () => {
    it('makes a POST call to the /acl/tokens endpoint', () => {
      nock(/localhost/).post('/v1/acl/tokens').reply(200, token);

      return expect(client.createToken({
        Name, Type, Policies, Global,
      })).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/acl/tokens');

        expect(body).to.deep.equal(token);
      });
    });

    it('allows for an optional Name', () => {
      Name = undefined;
      token.Name = '';

      nock(/localhost/).post('/v1/acl/tokens').reply(200, (uri, body) => {
        expect(body).to.deep.equal({ Type, Policies, Global });

        return token;
      });

      return expect(client.createToken({
        Name, Type, Policies, Global,
      })).to.eventually.be.fulfilled.then(([, body]) => {
        expect(body).to.deep.equal(token);
      });
    });

    it('allows for the ACL token to optionally be made global', () => {
      Global = undefined;
      token.Global = false;

      nock(/localhost/).post('/v1/acl/tokens').reply(200, (uri, body) => {
        expect(body).to.deep.equal({ Name, Type, Policies });

        return token;
      });

      return expect(client.createToken({
        Name, Type, Policies, Global,
      })).to.eventually.be.fulfilled.then(([, body]) => {
        expect(body).to.deep.equal(token);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).post('/v1/acl/tokens').reply(200, token);

      return client.createToken({
        Name, Type, Policies, Global,
      }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/acl/tokens').reply(200, token);

      client.createToken({
        Name, Type, Policies, Global,
      }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/acl/tokens');
        expect(body).to.deep.equal(token);

        done();
      });
    });
  });

  describe('#updateToken', () => {
    it('makes a POST call to the /acl/token/:AccessorID endpoint', () => {
      nock(/localhost/).post(`/v1/acl/token/${AccessorID}`).reply(200, token);

      return expect(client.updateToken({
        AccessorID, Name, Type, Policies,
      })).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal(`/v1/acl/token/${AccessorID}`);

        expect(body).to.deep.equal(token);
      });
    });

    it('allows for an optional Name update', () => {
      Name = undefined;
      token.Name = '';

      nock(/localhost/).post(`/v1/acl/token/${AccessorID}`).reply(200, (uri, body) => {
        expect(body).to.deep.equal({ AccessorID, Type, Policies });

        return token;
      });

      return expect(client.updateToken({
        AccessorID, Name, Type, Policies,
      })).to.eventually.be.fulfilled.then(([, body]) => {
        expect(body).to.deep.equal(token);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).post(`/v1/acl/token/${AccessorID}`).reply(200, token);

      return client.updateToken({
        AccessorID, Name, Type, Policies,
      }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/acl/token/${AccessorID}`).reply(200, token);

      client.updateToken({
        AccessorID, Name, Type, Policies,
      }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal(`/v1/acl/token/${AccessorID}`);
        expect(body).to.deep.equal(token);

        done();
      });
    });
  });

  describe('#readToken', () => {
    it('makes a GET call to the /acl/token endpoint', () => {
      nock(/localhost/).get(`/v1/acl/token/${AccessorID}`).reply(200, token);

      return expect(client.readToken({ AccessorID })).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal(`/v1/acl/token/${AccessorID}`);

        expect(body).to.deep.equal(token);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get(`/v1/acl/token/${AccessorID}`).reply(200, token);

      return client.readToken({ AccessorID }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/acl/token/${AccessorID}`).reply(200, token);

      client.readToken({ AccessorID }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal(`/v1/acl/token/${AccessorID}`);
        expect(body).to.deep.equal(token);

        done();
      });
    });
  });

  describe('#readSelfToken', () => {
    it('makes a GET call to the /acl/token/self endpoint', () => {
      nock(/localhost/).get('/v1/acl/token/self').reply(200, token);

      return expect(client.readSelfToken()).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/acl/token/self');

        expect(body).to.deep.equal(token);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get('/v1/acl/token/self').reply(200, token);

      return client.readSelfToken().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/acl/token/self').reply(200, token);

      client.readSelfToken((err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/acl/token/self');
        expect(body).to.deep.equal(token);

        done();
      });
    });
  });

  describe('#deleteToken', () => {
    it('makes a DELETE call to the /acl/token endpoint', () => {
      nock(/localhost/).delete(`/v1/acl/token/${AccessorID}`).reply(200);

      return expect(client.deleteToken({ AccessorID })).eventually.fulfilled.then(([res]) => {
        expect(res.req.path).to.equal(`/v1/acl/token/${AccessorID}`);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).delete(`/v1/acl/token/${AccessorID}`).reply(200);

      return client.deleteToken({ AccessorID }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete(`/v1/acl/token/${AccessorID}`).reply(200);

      client.deleteToken({ AccessorID }, (err, [res]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal(`/v1/acl/token/${AccessorID}`);

        done();
      });
    });
  });
});
