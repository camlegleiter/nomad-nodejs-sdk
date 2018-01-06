import esc from 'url-escape-tag';

import Nomad from '../nomad';
import BaseAPI from './base';

Nomad.Deployment = class extends BaseAPI {
  // prefix (string: "")- Specifies a string to filter deployments on based on an index prefix. This
  //   is specified as a querystring parameter.
  listDeployments({ Prefix = '' }, callback) {
    return Promise.try(() => {
      const qs = {};
      if (Prefix !== undefined && Prefix !== '') {
        qs.prefix = Prefix;
      }

      return this.request.getAsync({
        qs,
        uri: 'deployments',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // :deployment_id (string: <required>)- Specifies the UUID of the deployment. This must be the
  //   full UUID, not the short 8-character one. This is specified as part of the path.
  readDeployment({ DeploymentID }, callback) {
    return this.request.getAsync({
      uri: esc`deployment/${DeploymentID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :deployment_id (string: <required>)- Specifies the UUID of the deployment. This must be the
  //   full UUID, not the short 8-character one. This is specified as part of the path.
  listAllocations({ DeploymentID }, callback) {
    return this.request.getAsync({
      uri: esc`deployment/allocations/${DeploymentID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :deployment_id (string: <required>)- Specifies the UUID of the deployment. This must be the
  //   full UUID, not the short 8-character one. This is specified as part of the path.
  failDeployment({ DeploymentID }, callback) {
    return this.request.postAsync({
      uri: esc`deployment/fail/${DeploymentID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :deployment_id (string: <required>)- Specifies the UUID of the deployment. This must be the
  //   full UUID, not the short 8-character one. This is specified as part of the path.
  // Pause (bool: false) - Specifies whether to pause or resume the deployment.
  pauseDeployment({ DeploymentID, Pause = false }, callback) {
    return this.request.postAsync({
      body: {
        DeploymentID,
        Pause,
      },
      uri: esc`deployment/pause/${DeploymentID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :deployment_id (string: <required>)- Specifies the UUID of the deployment. This must be the
  //   full UUID, not the short 8-character one. This is specified as part of the path and JSON
  //   payload.
  // All (bool: false) - Specifies whether all task groups should be promoted.
  // Groups (array<string>: nil) - Specifies a particular set of task groups that should be
  //   promoted.
  promoteDeployment({ DeploymentID, All = false, Groups = null }, callback) {
    return Promise.try(() => {
      const body = {
        All,
        DeploymentID,
      };
      if (Groups) {
        body.Groups = Groups;
      }

      return this.request.postAsync({
        body,
        uri: esc`deployment/promote/${DeploymentID}`,
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // :deployment_id (string: <required>)- Specifies the UUID of the deployment. This must be the
  //   full UUID, not the short 8-character one. This is specified as part of the path and the JSON
  //   payload.
  // HealthyAllocationIDs (array<string>: nil) - Specifies the set of allocation that should be
  //   marked as healthy.
  // UnhealthyAllocationIDs (array<string>: nil) - Specifies the set of allocation that should be
  //   marked as unhealthy.
  setAllocationHealth({
    DeploymentID, HealthyAllocationIDs = null, UnhealthyAllocationIDs = null,
  }, callback) {
    const body = { DeploymentID };
    if (HealthyAllocationIDs) {
      body.HealthyAllocationIDs = HealthyAllocationIDs;
    }
    if (UnhealthyAllocationIDs) {
      body.UnhealthyAllocationIDs = UnhealthyAllocationIDs;
    }

    return this.request.postAsync({
      body,
      uri: esc`deployment/allocation-health/${DeploymentID}`,
    })
    .bind(this)
    .asCallback(callback);
  }
};
