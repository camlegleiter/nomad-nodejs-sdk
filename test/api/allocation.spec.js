const nock = require('nock');

const Nomad = require('../../src');

describe('Nomad.Allocation', () => {
  let Prefix;
  let AllocationID;

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    AllocationID = 'fb2170a8-257d-3c64-b14d-bc06cc94e34c';
    Prefix = 'fb2170a8';

    client = new Nomad.Allocation();
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

  describe('#listAllocations', () => {
    let allocations;

    beforeEach(() => {
      allocations = [
        {
          ID: AllocationID,
          EvalID: '43c1c6a3-6b75-5eb5-6584-7ab711a0eca6',
          Name: 'example.cache[0]',
          NodeID: '08469897-673f-d70b-3825-e00f97b43015',
          JobID: 'example',
          JobVersion: 0,
          TaskGroup: 'cache',
        },
      ];
    });

    it('makes a GET call to the /allocations endpoint', async () => {
      nock(/localhost/).get('/v1/allocations').reply(200, allocations);

      const [, body] = await client.listAllocations();
      expect(body).toEqual(allocations);
    });

    it('allows for a prefix to be set', async () => {
      nock(/localhost/).get('/v1/allocations').query({
        prefix: Prefix,
      }).reply(200, allocations);

      const [, body] = await client.listAllocations({ Prefix });
      expect(body).toEqual(allocations);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/allocations').reply(200, allocations);

      client.listAllocations((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(allocations);
        done();
      });
    });
  });

  describe('#readAllocation', () => {
    let allocation;

    beforeEach(() => {
      allocation = {
        ID: AllocationID,
        EvalID: '43c1c6a3-6b75-5eb5-6584-7ab711a0eca6',
        Name: 'example.cache[0]',
        NodeID: '08469897-673f-d70b-3825-e00f97b43015',
        JobID: 'example',
        JobVersion: 0,
        TaskGroup: 'cache',
      };
    });

    it('makes a GET call to the /allocation/:id endpoint', async () => {
      nock(/localhost/).get(`/v1/allocation/${AllocationID}`).reply(200, allocation);

      const [, body] = await client.readAllocation({ AllocationID });
      expect(body).toEqual(allocation);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/allocation/${AllocationID}`).reply(200, allocation);

      client.readAllocation({ AllocationID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(allocation);
        done();
      });
    });
  });
});
