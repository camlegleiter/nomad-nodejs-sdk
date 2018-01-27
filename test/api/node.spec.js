import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Node', () => {
  let Prefix;
  let NodeID;

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    NodeID = 'fb2170a8-257d-3c64-b14d-bc06cc94e34c';
    Prefix = 'fb2170a8';

    client = new Nomad.Node();
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

  describe('#listNodes', () => {
    let nodes;

    beforeEach(() => {
      nodes = [
        {
          ID: NodeID,
          Datacenter: 'dc1',
          Name: 'bacon-mac',
          NodeClass: '',
          Drain: false,
          Status: 'ready',
          StatusDescription: '',
          CreateIndex: 5,
          ModifyIndex: 45,
        },
      ];
    });

    it('makes a GET call to the /nodes endpoint', async () => {
      nock(/localhost/).get('/v1/nodes').reply(200, nodes);

      const [, body] = await client.listNodes();
      expect(body).toEqual(nodes);
    });

    it('allows for a prefix to be set', async () => {
      nock(/localhost/).get('/v1/nodes').query({
        prefix: Prefix,
      }).reply(200, nodes);

      const [, body] = await client.listNodes({ Prefix });
      expect(body).toEqual(nodes);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/nodes').reply(200, nodes);

      client.listNodes((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(nodes);
        done();
      });
    });
  });

  describe('#readNode', () => {
    let node;

    beforeEach(() => {
      node = {
        ID: NodeID,
        SecretID: '',
        Datacenter: 'dc1',
        Name: 'bacon-mac',
        HTTPAddr: '127.0.0.1:4646',
        TLSEnabled: false,
        Attributes: {},
        Resources: {},
        Reserved: {},
        Links: null,
        Meta: null,
        NodeClass: '',
        ComputedClass: 'v1:10952212473894849978',
        Drain: false,
        Status: 'ready',
        StatusDescription: '',
        StatusUpdatedAt: 1495748907,
        CreateIndex: 5,
        ModifyIndex: 45,
      };
    });

    it('makes a GET call to the /node/:node_id endpoint', async () => {
      nock(/localhost/).get(`/v1/node/${NodeID}`).reply(200, node);

      const [, body] = await client.readNode({ NodeID });
      expect(body).toEqual(node);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/node/${NodeID}`).reply(200, node);

      client.readNode({ NodeID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(node);
        done();
      });
    });
  });

  describe('#listNodeAllocations', () => {
    let allocations;

    beforeEach(() => {
      allocations = [
        {
          NodeID,
          ID: '8dfa702d-0c03-6fd4-ade6-386d72fb8192',
          EvalID: 'a128568e-6cc6-0f95-f37d-3fd4c8123316',
          Name: 'example.cache[0]',
          JobID: 'example',
          Job: {},
        },
      ];
    });

    it('makes a GET call to the /node/:node_id/allocations endpoint', async () => {
      nock(/localhost/).get(`/v1/node/${NodeID}/allocations`).reply(200, allocations);

      const [, body] = await client.listNodeAllocations({ NodeID });
      expect(body).toEqual(allocations);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/node/${NodeID}/allocations`).reply(200, allocations);

      client.listNodeAllocations({ NodeID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(allocations);
        done();
      });
    });
  });

  describe('#createNodeEvaluation', () => {
    let evaluation;

    beforeEach(() => {
      evaluation = {
        HeartbeatTTL: 0,
        EvalIDs: ['4ff1c7a2-c650-4058-f509-d5028ff9566e'],
        EvalCreateIndex: 85,
        NodeModifyIndex: 0,
        LeaderRPCAddr: '127.0.0.1:4647',
        NumNodes: 1,
        Servers: [],
        Index: 85,
        LastContact: 0,
        KnownLeader: false,
      };
    });

    it('makes a GET call to the /node/:node_id/evaluate endpoint', async () => {
      nock(/localhost/).post(`/v1/node/${NodeID}/evaluate`).reply(200, evaluation);

      const [, body] = await client.createNodeEvaluation({ NodeID });
      expect(body).toEqual(evaluation);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/node/${NodeID}/evaluate`).reply(200, evaluation);

      client.createNodeEvaluation({ NodeID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(evaluation);
        done();
      });
    });
  });

  describe('#drainNode', () => {
    let evaluation;

    beforeEach(() => {
      evaluation = {
        EvalIDs: ['4ff1c7a2-c650-4058-f509-d5028ff9566e'],
        EvalCreateIndex: 85,
        NodeModifyIndex: 0,
        Index: 85,
        LastContact: 0,
        KnownLeader: false,
      };
    });

    it('makes a GET call to the /node/:node_id/evaluate endpoint', async () => {
      nock(/localhost/).post(`/v1/node/${NodeID}/drain`).query({
        enable: false,
      }).reply(200, evaluation);

      const [, body] = await client.drainNode({ NodeID });
      expect(body).toEqual(evaluation);
    });

    it('allows for drain mode to be enabled', async () => {
      const Enable = true;

      nock(/localhost/).post(`/v1/node/${NodeID}/drain`).query({
        enable: Enable,
      }).reply(200, evaluation);

      const [, body] = await client.drainNode({ NodeID, Enable });
      expect(body).toEqual(evaluation);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/node/${NodeID}/drain`).query({
        enable: false,
      }).reply(200, evaluation);

      client.drainNode({ NodeID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(evaluation);
        done();
      });
    });
  });

  describe('#purgeNode', () => {
    let evaluation;

    beforeEach(() => {
      evaluation = {
        EvalIDs: ['4ff1c7a2-c650-4058-f509-d5028ff9566e'],
        EvalCreateIndex: 85,
        NodeModifyIndex: 0,
        Index: 85,
        LastContact: 0,
        KnownLeader: false,
      };
    });

    it('makes a GET call to the /node/:node_id/evaluate endpoint', async () => {
      nock(/localhost/).post(`/v1/node/${NodeID}/purge`).reply(200, evaluation);

      const [, body] = await client.purgeNode({ NodeID });
      expect(body).toEqual(evaluation);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/node/${NodeID}/purge`).reply(200, evaluation);

      client.purgeNode({ NodeID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(evaluation);
        done();
      });
    });
  });
});
