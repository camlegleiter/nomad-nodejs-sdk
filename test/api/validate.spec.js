const nock = require('nock');

const Nomad = require('../../src');

describe('Nomad.Validate', () => {
  const validation = { Warnings: '', Error: '' };

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
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

  describe('#validateJob', () => {
    const Job = {};

    beforeEach(() => {
      client = new Nomad.Validate();
    });

    it('makes a POST call to the /validate/job endpoint', async () => {
      nock(/localhost/).post('/v1/validate/job').reply(200, validation);

      const [, body] = await client.validateJob({ Job });
      expect(body).toEqual(validation);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/validate/job').reply(200, validation);

      client.validateJob({ Job }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(validation);
        done();
      });
    });
  });
});
