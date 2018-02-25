import nock from 'nock';

import Nomad from '../../src';

describe('Nomad.Job', () => {
  let Job;
  let JobID;
  let Prefix;

  let client;
  let job;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    Job = {};
    Prefix = 'ex';
    JobID = 'example';

    job = {
      ID: JobID,
      ParentID: '',
      Name: 'example',
      Type: 'service',
      Priority: 50,
      Status: 'pending',
      StatusDescription: '',
      JobSummary: {},
    };

    client = new Nomad.Job();
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

  describe('#listJobs', () => {
    let jobs;

    beforeEach(() => {
      jobs = [job];
    });

    it('makes a GET call to the /jobs endpoint', async () => {
      nock(/localhost/).get('/v1/jobs').reply(200, jobs);

      const [, body] = await client.listJobs();
      expect(body).toEqual(jobs);
    });

    it('allows for a prefix to be set', async () => {
      nock(/localhost/).get('/v1/jobs').query({
        prefix: Prefix,
      }).reply(200, jobs);

      const [, body] = await client.listJobs({ Prefix });
      expect(body).toEqual(jobs);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/jobs').reply(200, jobs);

      client.listJobs((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(jobs);
        done();
      });
    });
  });

  describe('#createJob', () => {
    it('makes a POST call to the /jobs endpoint', async () => {
      nock(/localhost/).post('/v1/jobs').reply(200, (_, body) => {
        expect(body.Job).toEqual(Job);
        expect(body.EnforceIndex).toBe(false);
        expect(body.JobModifyIndex).toBe(0);
        expect(body.PolicyOverride).toBe(false);
        return job;
      });

      const [, body] = await client.createJob({ Job });
      expect(body).toEqual(job);
    });

    it('allows for the Job EnforceIndex to be set', async () => {
      const EnforceIndex = true;

      nock(/localhost/).post('/v1/jobs').reply(200, (_, body) => {
        expect(body.EnforceIndex).toBe(EnforceIndex);
        return job;
      });

      await client.createJob({ Job, EnforceIndex });
    });

    it('allows for the JobModifyIndex to be forced', async () => {
      const JobModifyIndex = Math.random();

      nock(/localhost/).post('/v1/jobs').reply(200, (_, body) => {
        expect(body.JobModifyIndex).toBe(JobModifyIndex);
        return job;
      });

      await client.createJob({ Job, JobModifyIndex });
    });

    it('allows for the Job sentinel policy to be overridden', async () => {
      const PolicyOverride = true;

      nock(/localhost/).post('/v1/jobs').reply(200, (_, body) => {
        expect(body.PolicyOverride).toBe(PolicyOverride);
        return job;
      });

      await client.createJob({ Job, PolicyOverride });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post('/v1/jobs').reply(200, job);

      client.createJob({ Job }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(job);
        done();
      });
    });
  });

  describe('#readJob', () => {
    it('makes a GET call to the /job/:job_id endpoint', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}`).reply(200, job);

      const [, body] = await client.readJob({ JobID });
      expect(body).toEqual(job);
    });

    it('does a thing on 404', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}`).reply(404, 'job not found');

      await client.readJob({ JobID });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/job/${JobID}`).reply(200, job);

      client.readJob({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(job);
        done();
      });
    });
  });

  describe('#listJobVersions', () => {
    let versions;

    beforeEach(() => {
      versions = [
        {
          ...job,
          Version: 0,
          CreateIndex: 7,
          ModifyIndex: 7,
          JobModifyIndex: 7,
        },
      ];
    });

    it('makes a GET call to the /job/:job_id/versions endpoint', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/versions`).reply(200, versions);

      const [, body] = await client.listJobVersions({ JobID });
      expect(body).toEqual(versions);
    });

    it('returns a string response on 404', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/versions`).reply(404, 'job versions not found');

      const [, body] = await client.listJobVersions({ JobID });
      expect(body).toEqual('job versions not found');
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/job/${JobID}/versions`).reply(200, versions);

      client.listJobVersions({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(versions);
        done();
      });
    });
  });

  describe('#listJobAllocations', () => {
    let allocations;

    beforeEach(() => {
      allocations = [
        {
          JobID,
          ID: 'ed344e0a-7290-d117-41d3-a64f853ca3c2',
          EvalID: 'a9c5effc-2242-51b2-f1fe-054ee11ab189',
          Name: 'example.cache[0]',
          NodeID: 'cb1f6030-a220-4f92-57dc-7baaabdc3823',
        },
      ];
    });

    it('makes a GET call to the /job/:job_id/allocations endpoint', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/allocations`).reply(200, allocations);

      const [, body] = await client.listJobAllocations({ JobID });
      expect(body).toEqual(allocations);
    });

    it('returns a string response on 404', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/allocations`).reply(404, 'job allocations not found');

      const [, body] = await client.listJobAllocations({ JobID });
      expect(body).toEqual('job allocations not found');
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/job/${JobID}/allocations`).reply(200, allocations);

      client.listJobAllocations({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(allocations);
        done();
      });
    });
  });

  describe('#listJobEvaluations', () => {
    let evaluations;

    beforeEach(() => {
      evaluations = [
        {
          JobID,
          ID: 'a9c5effc-2242-51b2-f1fe-054ee11ab189',
          Priority: 50,
          Type: 'service',
          TriggeredBy: 'job-register',
          JobModifyIndex: 7,
          NodeID: '',
          NodeModifyIndex: 0,
        },
      ];
    });

    it('makes a GET call to the /job/:job_id/evaluations endpoint', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/evaluations`).reply(200, evaluations);

      const [, body] = await client.listJobEvaluations({ JobID });
      expect(body).toEqual(evaluations);
    });

    it('returns a string response on 404', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/evaluations`).reply(404, 'job evaluations not found');

      const [, body] = await client.listJobEvaluations({ JobID });
      expect(body).toEqual('job evaluations not found');
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/job/${JobID}/evaluations`).reply(200, evaluations);

      client.listJobEvaluations({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(evaluations);
        done();
      });
    });
  });

  describe('#listJobDeployments', () => {
    let deployments;

    beforeEach(() => {
      deployments = [
        {
          JobID,
          ID: '85ee4a9a-339f-a921-a9ef-0550d20b2c61',
          JobVersion: 1,
          JobModifyIndex: 19,
          JobCreateIndex: 7,
          TaskGroups: {},
        },
      ];
    });

    it('makes a GET call to the /job/:job_id/deployments endpoint', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/deployments`).reply(200, deployments);

      const [, body] = await client.listJobDeployments({ JobID });
      expect(body).toEqual(deployments);
    });

    it('returns an empty list for an unknown JobID', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/deployments`).reply(200, []);

      const [, body] = await client.listJobDeployments({ JobID });
      expect(body).toEqual([]);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/job/${JobID}/deployments`).reply(200, deployments);

      client.listJobDeployments({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(deployments);
        done();
      });
    });
  });

  describe('#readMostRecentDeployment', () => {
    let deployment;

    beforeEach(() => {
      deployment = {
        JobID,
        ID: '85ee4a9a-339f-a921-a9ef-0550d20b2c61',
        JobVersion: 1,
        JobModifyIndex: 19,
        JobCreateIndex: 7,
        TaskGroups: {},
      };
    });

    it('makes a GET call to the /job/:job_id/deployment endpoint', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/deployment`).reply(200, deployment);

      const [, body] = await client.readMostRecentDeployment({ JobID });
      expect(body).toEqual(deployment);
    });

    it('returns null on unknown JobID', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/deployment`).reply(200, 'null');

      const [, body] = await client.readMostRecentDeployment({ JobID });
      expect(body).toEqual(null);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/job/${JobID}/deployment`).reply(200, deployment);

      client.readMostRecentDeployment({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(deployment);
        done();
      });
    });
  });

  describe('#readJobSummary', () => {
    let summary;

    beforeEach(() => {
      summary = {
        JobID,
        Summary: {
          cache: {
            Queued: 0,
            Complete: 0,
            Failed: 0,
            Running: 1,
            Starting: 0,
            Lost: 0,
          },
        },
        Children: {
          Pending: 0,
          Running: 0,
          Dead: 0,
        },
        CreateIndex: 7,
        ModifyIndex: 13,
      };
    });

    it('makes a GET call to the /job/:job_id/summary endpoint', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/summary`).reply(200, summary);

      const [, body] = await client.readJobSummary({ JobID });
      expect(body).toEqual(summary);
    });

    it('returns a string response on 404', async () => {
      nock(/localhost/).get(`/v1/job/${JobID}/summary`).reply(404, 'job not found');

      const [, body] = await client.readJobSummary({ JobID });
      expect(body).toEqual('job not found');
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/job/${JobID}/summary`).reply(200, summary);

      client.readJobSummary({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(summary);
        done();
      });
    });
  });

  describe('#updateJob', () => {
    let response;

    beforeEach(() => {
      response = {
        JobModifyIndex: 0,
      };
    });

    it('makes a POST call to the /job/:job_id endpoint', async () => {
      nock(/localhost/).post(`/v1/job/${JobID}`, {
        Job,
        EnforceIndex: false,
        JobModifyIndex: 0,
        PolicyOverride: false,
      }).reply(200, response);

      const [, body] = await client.updateJob({ JobID, Job });
      expect(body).toEqual(response);
    });

    it('allows for the index to be enforced', async () => {
      const EnforceIndex = true;

      nock(/localhost/).post(`/v1/job/${JobID}`, {
        Job,
        EnforceIndex,
        JobModifyIndex: 0,
        PolicyOverride: false,
      }).reply(200, response);

      const [, body] = await client.updateJob({ JobID, Job, EnforceIndex });
      expect(body).toEqual(response);
    });

    it('allows for the job modify index to be set', async () => {
      const JobModifyIndex = 3;

      nock(/localhost/).post(`/v1/job/${JobID}`, {
        Job,
        EnforceIndex: false,
        JobModifyIndex,
        PolicyOverride: false,
      }).reply(200, response);

      const [, body] = await client.updateJob({ JobID, Job, JobModifyIndex });
      expect(body).toEqual(response);
    });

    it('allows for the sentinel policy to be overridden', async () => {
      const PolicyOverride = true;

      nock(/localhost/).post(`/v1/job/${JobID}`, {
        Job,
        EnforceIndex: false,
        JobModifyIndex: 0,
        PolicyOverride,
      }).reply(200, response);

      const [, body] = await client.updateJob({ JobID, Job, PolicyOverride });
      expect(body).toEqual(response);
    });
  });

  describe('#dispatchJob', () => {
    let response;

    beforeEach(() => {
      response = {
        JobModifyIndex: 0,
      };
    });

    it('makes a POST call to the /job/:job_id/dispatch endpoint', async () => {
      nock(/localhost/).post(`/v1/job/${JobID}/dispatch`, {
        Payload: '',
        Meta: null,
      }).reply(200, response);

      const [, body] = await client.dispatchJob({ JobID });
      expect(body).toEqual(response);
    });

    it('allows for a payload to be set', async () => {
      const Payload = Buffer.from('foo').toString('base64');

      nock(/localhost/).post(`/v1/job/${JobID}/dispatch`, {
        Payload,
        Meta: null,
      }).reply(200, response);

      const [, body] = await client.dispatchJob({ JobID, Payload });
      expect(body).toEqual(response);
    });

    it('allows for the client to specify arbitrary metadata', async () => {
      const Meta = { foo: 'bar' };

      nock(/localhost/).post(`/v1/job/${JobID}/dispatch`, {
        Payload: '',
        Meta,
      }).reply(200, response);

      const [, body] = await client.dispatchJob({ JobID, Meta });
      expect(body).toEqual(response);
    });
  });

  describe('#revertToOlderJobVersion', () => {
    let response;

    beforeEach(() => {
      response = {
        JobModifyIndex: 0,
      };
    });

    it('makes a POST call to the /job/:job_id/revert endpoint', async () => {
      nock(/localhost/).post(`/v1/job/${JobID}/revert`, {
        JobID,
        JobVersion: 0,
      }).reply(200, response);

      const [, body] = await client.revertToOlderJobVersion({ JobID });
      expect(body).toEqual(response);
    });

    it('allows for a job version to be set', async () => {
      const JobVersion = 3;

      nock(/localhost/).post(`/v1/job/${JobID}/revert`, {
        JobID,
        JobVersion,
      }).reply(200, response);

      const [, body] = await client.revertToOlderJobVersion({ JobID, JobVersion });
      expect(body).toEqual(response);
    });

    it('allows for the job prior version to be enforced', async () => {
      const EnforcePriorVersion = 1;

      nock(/localhost/).post(`/v1/job/${JobID}/revert`, {
        JobID,
        JobVersion: 0,
        EnforcePriorVersion,
      }).reply(200, response);

      const [, body] = await client.revertToOlderJobVersion({ JobID, EnforcePriorVersion });
      expect(body).toEqual(response);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/job/${JobID}/revert`, {
        JobID,
        JobVersion: 0,
      }).reply(200, response);

      client.revertToOlderJobVersion({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(response);
        done();
      });
    });
  });

  describe('#setJobStability', () => {
    let response;

    beforeEach(() => {
      response = {
        JobModifyIndex: 0,
      };
    });

    it('makes a POST call to the /job/:job_id/stable endpoint', async () => {
      nock(/localhost/).post(`/v1/job/${JobID}/stable`, {
        JobID,
        JobVersion: 0,
        Stable: false,
      }).reply(200, response);

      const [, body] = await client.setJobStability({ JobID });
      expect(body).toEqual(response);
    });

    it('allows for a job version to be set', async () => {
      const JobVersion = 3;

      nock(/localhost/).post(`/v1/job/${JobID}/stable`, {
        JobID,
        JobVersion,
        Stable: false,
      }).reply(200, response);

      const [, body] = await client.setJobStability({ JobID, JobVersion });
      expect(body).toEqual(response);
    });

    it('allows for the job sentinel policy to be overridden', async () => {
      const Stable = true;

      nock(/localhost/).post(`/v1/job/${JobID}/stable`, {
        JobID,
        JobVersion: 0,
        Stable,
      }).reply(200, response);

      const [, body] = await client.setJobStability({ JobID, Stable });
      expect(body).toEqual(response);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/job/${JobID}/stable`, {
        JobID,
        JobVersion: 0,
        Stable: false,
      }).reply(200, response);

      client.setJobStability({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(response);
        done();
      });
    });
  });

  describe('#createJobEvaluation', () => {
    let evaluation;

    beforeEach(() => {
      evaluation = {
        EvalID: 'd092fdc0-e1fd-2536-67d8-43af8ca798ac',
        EvalCreateIndex: 35,
        JobModifyIndex: 34,
      };
    });

    it('makes a POST call to the /job/:job_id/evaluate endpoint', async () => {
      nock(/localhost/).post(`/v1/job/${JobID}/evaluate`).reply(200, evaluation);

      const [, body] = await client.createJobEvaluation({ JobID });
      expect(body).toEqual(evaluation);
    });

    it('returns a string response on missing job', async () => {
      nock(/localhost/).post(`/v1/job/${JobID}/evaluate`).reply(500, 'job not found');

      const [, body] = await client.createJobEvaluation({ JobID });
      expect(body).toEqual('job not found');
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/job/${JobID}/evaluate`).reply(200, evaluation);

      client.createJobEvaluation({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(evaluation);
        done();
      });
    });
  });

  describe('#createJobPlan', () => {
    let plan;

    beforeEach(() => {
      plan = {
        Index: 0,
        NextPeriodicLaunch: '0001-01-01T00:00:00Z',
        Warnings: '',
        Diff: {},
      };
    });

    it('makes a POST call to the /job/:job_id/periodic/force endpoint', async () => {
      nock(/localhost/).post(`/v1/job/${JobID}/plan`, {
        Job,
        Diff: false,
        PolicyOverride: false,
      }).reply(200, plan);

      const [, body] = await client.createJobPlan({ JobID, Job });
      expect(body).toEqual(plan);
    });

    it('allows for a job diff to be returned', async () => {
      const Diff = true;

      nock(/localhost/).post(`/v1/job/${JobID}/plan`, {
        Job,
        Diff,
        PolicyOverride: false,
      }).reply(200, plan);

      const [, body] = await client.createJobPlan({ JobID, Job, Diff });
      expect(body).toEqual(plan);
    });

    it('allows for the job sentinel policy to be overridden', async () => {
      const PolicyOverride = true;

      nock(/localhost/).post(`/v1/job/${JobID}/plan`, {
        Job,
        Diff: false,
        PolicyOverride,
      }).reply(200, plan);

      const [, body] = await client.createJobPlan({ JobID, Job, PolicyOverride });
      expect(body).toEqual(plan);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/job/${JobID}/plan`).reply(200, plan);

      client.createJobPlan({ JobID, Job }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(plan);
        done();
      });
    });
  });

  describe('#forceNewPeriodicEpisode', () => {
    let evaluation;

    beforeEach(() => {
      evaluation = {
        EvalID: 'd092fdc0-e1fd-2536-67d8-43af8ca798ac',
        EvalCreateIndex: 35,
        JobModifyIndex: 34,
      };
    });

    it('makes a POST call to the /job/:job_id/periodic/force endpoint', async () => {
      nock(/localhost/).post(`/v1/job/${JobID}/periodic/force`).reply(200, evaluation);

      const [, body] = await client.forceNewPeriodicEpisode({ JobID });
      expect(body).toEqual(evaluation);
    });

    it('returns a string response on 404', async () => {
      nock(/localhost/).post(`/v1/job/${JobID}/periodic/force`).reply(404, 'job not found');

      const [, body] = await client.forceNewPeriodicEpisode({ JobID });
      expect(body).toEqual('job not found');
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).post(`/v1/job/${JobID}/periodic/force`).reply(200, evaluation);

      client.forceNewPeriodicEpisode({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(evaluation);
        done();
      });
    });
  });

  describe('#stopJob', () => {
    let evaluation;

    beforeEach(() => {
      evaluation = {
        EvalID: 'd092fdc0-e1fd-2536-67d8-43af8ca798ac',
        EvalCreateIndex: 35,
        JobModifyIndex: 34,
      };
    });

    it('makes a DELETE call to the /job/:job_id endpoint', async () => {
      nock(/localhost/).delete(`/v1/job/${JobID}`).reply(200, evaluation);

      const [, body] = await client.stopJob({ JobID });
      expect(body).toEqual(evaluation);
    });

    it('allows for the job to be stopped and purged', async () => {
      const Purge = true;

      nock(/localhost/).delete(`/v1/job/${JobID}`).query({
        purge: Purge,
      }).reply(200, evaluation);

      const [, body] = await client.stopJob({ JobID, Purge });
      expect(body).toEqual(evaluation);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).delete(`/v1/job/${JobID}`).reply(200, evaluation);

      client.stopJob({ JobID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(evaluation);
        done();
      });
    });
  });
});
