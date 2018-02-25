import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Evaluation', () => {
  let Prefix;
  let EvaluationID;

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    EvaluationID = 'fb2170a8-257d-3c64-b14d-bc06cc94e34c';
    Prefix = 'fb2170a8';

    client = new Nomad.Evaluation();
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

  describe('#listEvaluations', () => {
    let evaluations;

    beforeEach(() => {
      evaluations = [
        {
          ID: EvaluationID,
          Namespace: 'default',
          Priority: 50,
          Type: 'service',
          TriggeredBy: 'job-register',
          JobID: 'example',
          JobModifyIndex: 7,
        },
      ];
    });

    it('makes a GET call to the /evaluations endpoint', async () => {
      nock(/localhost/).get('/v1/evaluations').reply(200, evaluations);

      const [, body] = await client.listEvaluations();
      expect(body).toEqual(evaluations);
    });

    it('allows for a prefix to be set', async () => {
      nock(/localhost/).get('/v1/evaluations').query({
        prefix: Prefix,
      }).reply(200, evaluations);

      const [, body] = await client.listEvaluations({ Prefix });
      expect(body).toEqual(evaluations);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/evaluations').reply(200, evaluations);

      client.listEvaluations((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(evaluations);
        done();
      });
    });
  });

  describe('#readEvaluation', () => {
    let evaluation;

    beforeEach(() => {
      evaluation = {
        ID: EvaluationID,
        Namespace: 'default',
        Priority: 50,
        Type: 'service',
        TriggeredBy: 'job-register',
        JobID: 'example',
        JobModifyIndex: 7,
      };
    });

    it('makes a GET call to the /evaluation/:id endpoint', async () => {
      nock(/localhost/).get(`/v1/evaluation/${EvaluationID}`).reply(200, evaluation);

      const [, body] = await client.readEvaluation({ EvaluationID });
      expect(body).toEqual(evaluation);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/evaluation/${EvaluationID}`).reply(200, evaluation);

      client.readEvaluation({ EvaluationID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(evaluation);
        done();
      });
    });
  });

  describe('#listAllocations', () => {
    let allocations;

    beforeEach(() => {
      allocations = [
        {
          ID: '8dfa702d-0c03-6fd4-ade6-386d72fb8192',
          EvalID: EvaluationID,
          Name: 'example.cache[0]',
          JobID: 'example',
          Job: {},
        },
      ];
    });

    it('makes a GET call to the /evaluation/:id/allocations endpoint', async () => {
      nock(/localhost/).get(`/v1/evaluation/${EvaluationID}/allocations`).reply(200, allocations);

      const [, body] = await client.listAllocations({ EvaluationID });
      expect(body).toEqual(allocations);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/evaluation/${EvaluationID}/allocations`).reply(200, allocations);

      client.listAllocations({ EvaluationID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(allocations);
        done();
      });
    });
  });
});
