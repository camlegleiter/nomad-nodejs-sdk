const Promise = require('bluebird');
const esc = require('url-escape-tag');

const BaseAPI = require('./base');
const Nomad = require('../nomad');

Nomad.Job = class extends BaseAPI {
  // prefix (string: "") - Specifies a string to filter jobs on based on an index prefix. This is
  //   specified as a querystring parameter.
  listJobs(...args) {
    // { Prefix }, callback
    return Promise.try(() => {
      const [[{ Prefix = '' } = {}], callback] = BaseAPI.spread(...args);

      const qs = {};
      if (Prefix !== undefined && Prefix !== '') {
        qs.prefix = Prefix;
      }

      return this.request.getAsync({
        qs,
        uri: 'jobs',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // Job (Job: <required>) - Specifies the JSON definition of the job.
  // EnforceIndex (bool: false) - If set, the job will only be registered if the passed
  //   JobModifyIndex matches the current job's index. If the index is zero, the register only
  //   occurs if the job is new. This paradigm allows check-and-set style job updating.
  // JobModifyIndex (int: 0) - Specifies the JobModifyIndex to enforce the current job is at.
  // PolicyOverride (bool: false) - If set, any soft mandatory Sentinel policies will be overridden.
  //   This allows a job to be registered when it would be denied by policy.
  createJob({
    Job, EnforceIndex = false, JobModifyIndex = 0, PolicyOverride = false,
  }, callback) {
    return this.request.postAsync({
      body: {
        Job,
        EnforceIndex,
        JobModifyIndex,
        PolicyOverride,
      },
      uri: 'jobs',
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  readJob({ JobID }, callback) {
    return this.request.getAsync({
      uri: esc`job/${JobID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  listJobVersions({ JobID }, callback) {
    return this.request.getAsync({
      uri: esc`job/${JobID}/versions`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  listJobAllocations({ JobID }, callback) {
    return this.request.getAsync({
      uri: esc`job/${JobID}/allocations`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  listJobEvaluations({ JobID }, callback) {
    return this.request.getAsync({
      uri: esc`job/${JobID}/evaluations`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  listJobDeployments({ JobID }, callback) {
    return this.request.getAsync({
      uri: esc`job/${JobID}/deployments`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  readMostRecentDeployment({ JobID }, callback) {
    return this.request.getAsync({
      uri: esc`job/${JobID}/deployment`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  readJobSummary({ JobID }, callback) {
    return this.request.getAsync({
      uri: esc`job/${JobID}/summary`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  // Job (Job: <required>) - Specifies the JSON definition of the job.
  // EnforceIndex (bool: false) - If set, the job will only be registered if the passed
  //   JobModifyIndex matches the current job's index. If the index is zero, the register only
  //   occurs if the job is new. This paradigm allows check-and-set style job updating.
  // JobModifyIndex (int: 0) - Specifies the JobModifyIndex to enforce the current job is at.
  // PolicyOverride (bool: false) - If set, any soft mandatory Sentinel policies will be overridden.
  //   This allows a job to be registered when it would be denied by policy.
  updateJob({
    JobID, Job, EnforceIndex = false, JobModifyIndex = 0, PolicyOverride = false,
  }, callback) {
    return this.request.postAsync({
      body: {
        Job,
        EnforceIndex,
        JobModifyIndex,
        PolicyOverride,
      },
      uri: esc`job/${JobID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  // Payload (string: "") - Specifies a base64 encoded string containing the payload. This is
  //   limited to 15 KB.
  // Meta (meta<string|string>: nil) - Specifies arbitrary metadata to pass to the job.
  dispatchJob({ JobID, Payload = '', Meta = null }, callback) {
    return this.request.postAsync({
      body: {
        Payload,
        Meta,
      },
      uri: esc`job/${JobID}/dispatch`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // JobID (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  // JobVersion (integer: 0) - Specifies the job version to revert to.
  // EnforcePriorVersion (integer: nil) - Optional value specifying the current job's version. This
  //   is checked and acts as a check-and-set value before reverting to the specified job.
  revertToOlderJobVersion({ JobID, JobVersion = 0, EnforcePriorVersion = null }, callback) {
    return Promise.try(() => {
      const body = {
        JobID,
        JobVersion,
      };
      if (EnforcePriorVersion !== null) {
        body.EnforcePriorVersion = EnforcePriorVersion;
      }

      return this.request.postAsync({
        body,
        uri: esc`job/${JobID}/revert`,
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // JobID (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  // JobVersion (integer: 0) - Specifies the job version to set the stability on.
  // Stable (bool: false) - Specifies whether the job should be marked as stable or not.
  setJobStability({ JobID, JobVersion = 0, Stable = false }, callback) {
    return this.request.postAsync({
      body: {
        JobID,
        JobVersion,
        Stable,
      },
      uri: esc`job/${JobID}/stable`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  createJobEvaluation({ JobID }, callback) {
    return this.request.postAsync({
      uri: esc`job/${JobID}/evaluate`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in
  //   the job file during submission). This is specified as part of the path.
  // Job (string: <required>) - Specifies the JSON definition of the job.
  // Diff (bool: false) - Specifies whether the diff structure between the submitted and server side
  //   version of the job should be included in the response.
  // PolicyOverride (bool: false) - If set, any soft mandatory Sentinel policies will be overridden.
  //   This allows a job to be registered when it would be denied by policy.
  createJobPlan({
    JobID, Job, Diff = false, PolicyOverride = false,
  }, callback) {
    return this.request.postAsync({
      body: {
        Job,
        Diff,
        PolicyOverride,
      },
      uri: esc`job/${JobID}/plan`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  forceNewPeriodicEpisode({ JobID }, callback) {
    return this.request.postAsync({
      uri: esc`job/${JobID}/periodic/force`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :job_id (string: <required>) - Specifies the ID of the job (as specified in the job file during
  //   submission). This is specified as part of the path.
  // Purge (bool: false) - Specifies that the job should stopped and purged immediately. This means
  //   the job will not be queryable after being stopped. If not set, the job will be purged by the
  //   garbage collector.
  stopJob({ JobID, Purge = false }, callback) {
    return Promise.try(() => {
      const qs = {};
      if (Purge === true) {
        qs.purge = true;
      }

      return this.request.deleteAsync({
        qs,
        uri: esc`job/${JobID}`,
      })
      .bind(this)
      .asCallback(callback);
    });
  }
};
