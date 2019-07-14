const nock = require('nock');

const BaseAPI = require('../../src/api/base');
const Nomad = require('../../src');

describe('BaseAPI', () => {
  describe('#constructor', () => {
    it('uses the global config by default', () => {
      const base = new BaseAPI();

      expect(base.config).toEqual(Nomad.config);
    });

    it('overrides default config when provided as options', () => {
      const host = 'http://localhost:4647';
      const base = new BaseAPI({ host });

      expect(base.config.host).toBe(host);
    });

    describe('default request properties', () => {
      const token = 'token';

      let base;

      beforeEach(() => {
        base = new BaseAPI({ token });
      });

      it('defaults to v1 APIs', (done) => {
        nock(/localhost/).get(/\//).reply(200, (uri) => {
          expect(uri).toContain('v1');
        });

        base.request.get({ uri: '/' }, done);
      });

      it('sets the User-Agent header', (done) => {
        const header = `${Nomad.NAME}/${Nomad.VERSION}`;
        nock(/localhost/).get(/\//).reply(200, function reply() {
          expect(this.req.headers).toHaveProperty('user-agent', header);
        });

        base.request.get({ uri: '/' }, done);
      });

      it('sets the X-Nomad-Token header', (done) => {
        nock(/localhost/).get(/\//).reply(200, function reply() {
          expect(this.req.headers).toHaveProperty('x-nomad-token', token);
        });

        base.request.get({ uri: '/' }, done);
      });
    });
  });
});
