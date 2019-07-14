const Promise = require('bluebird');
const esc = require('url-escape-tag');

const BaseAPI = require('./base');
const Nomad = require('../nomad');

Nomad.SentinelPolicy = class extends BaseAPI {
  listPolicies(callback) {
    return this.request.getAsync({
      uri: 'sentinel/policies',
    })
    .bind(this)
    .asCallback(callback);
  }

  // Name (string: <required>) - Specifies the name of the policy. Creates the policy if the name
  //   does not exist, otherwise updates the existing policy.
  // Description (string: <optional>) - Specifies a human readable description.
  // Scope (string: <required>) - Specifies the scope of when this policy applies. Only submit-job
  //   is currently supported.
  // EnforcementLevel (string: <required>) - Specifies the enforcement level of the policy. Can be
  //   advisory which warns on failure, hard-mandatory which prevents an operation on failure, and
  //   soft-mandatory which is like hard-mandatory but can be overridden.
  // Policy (string: <required>) - Specifies the Sentinel policy itself.
  upsertPolicy({
    Name, Description, Scope, EnforcementLevel, Policy,
  }, callback) {
    return Promise.try(() => {
      const body = {
        Name,
        Scope,
        EnforcementLevel,
        Policy,
      };
      if (Description) {
        body.Description = Description;
      }

      return this.request.postAsync({
        body,
        uri: `sentinel/policy/${Name}`,
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // policy_name (string: <required>) - Specifies the policy name to read.
  readPolicy({ Name }, callback) {
    return this.request.getAsync({
      uri: esc`sentinel/policy/${Name}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // policy_name (string: <required>) - Specifies the policy name to delete.
  deletePolicy({ Name }, callback) {
    return this.request.deleteAsync({
      uri: esc`sentinel/policy/${Name}`,
    })
    .bind(this)
    .asCallback(callback);
  }
};
