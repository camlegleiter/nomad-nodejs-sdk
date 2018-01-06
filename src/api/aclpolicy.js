import esc from 'url-escape-tag';

import Nomad from '../nomad';
import BaseAPI from './base';

Nomad.ACLPolicy = class extends BaseAPI {
  listPolicies(callback) {
    return this.request.getAsync({
      uri: 'acl/policies',
    })
    .bind(this)
    .asCallback(callback);
  }

  // Name (string: <required>) - Specifies the name of the policy. Creates the policy if the name
  //   does not exist, otherwise updates the existing policy.
  // Description (string: <optional>) - Specifies a human readable description.
  // Rules (string: <required>) - Specifies the Policy rules in HCL or JSON format.
  upsertPolicy({ Name, Description, Rules }, callback) {
    return this.request.postAsync({
      body: {
        Name,
        Description,
        Rules,
      },
      uri: esc`acl/policy/${Name}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // Name (string: <required>) - Specifies the policy name to read.
  readPolicy({ Name }, callback) {
    return this.request.getAsync({
      uri: esc`acl/policy/${Name}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // Name (string: <required>) - Specifies the policy name to delete.
  deletePolicy({ Name }, callback) {
    return this.request.deleteAsync({
      uri: esc`acl/policy/${Name}`,
    })
    .bind(this)
    .asCallback(callback);
  }
};
