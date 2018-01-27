import Promise from 'bluebird';
import esc from 'url-escape-tag';

import Nomad from '../nomad';
import BaseAPI from './base';

Nomad.Node = class extends BaseAPI {
  // prefix (string: "")- Specifies a string to filter nodes on based on an index prefix. This is
  //   specified as a querystring parameter.
  listNodes(...args) {
    // { Prefix }, callback
    return Promise.try(() => {
      const [[{ Prefix = '' } = {}], callback] = BaseAPI.spread(...args);

      const qs = {};
      if (Prefix != null && Prefix !== '') {
        qs.prefix = Prefix;
      }

      return this.request.getAsync({
        qs,
        uri: 'nodes',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // :node_id (string: <required>)- Specifies the UUID of the node. This must be the full UUID, not
  //   the short 8-character one. This is specified as part of the path.
  readNode({ NodeID }, callback) {
    return this.request.getAsync({
      uri: esc`node/${NodeID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :node_id (string: <required>)- Specifies the UUID of the node. This must be the full UUID, not
  //   the short 8-character one. This is specified as part of the path.
  listNodeAllocations({ NodeID }, callback) {
    return this.request.getAsync({
      uri: esc`node/${NodeID}/allocations`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :node_id (string: <required>)- Specifies the UUID of the node. This must be the full UUID, not
  //   the short 8-character one. This is specified as part of the path.
  createNodeEvaluation({ NodeID }, callback) {
    return this.request.postAsync({
      uri: esc`node/${NodeID}/evaluate`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :node_id (string: <required>)- Specifies the UUID of the node. This must be the full UUID, not
  //   the short 8-character one. This is specified as part of the path.
  // enable (bool: <required>) - Specifies if drain mode should be enabled. This is specified as a
  //   query string parameter.
  drainNode({ NodeID, Enable = false }, callback) {
    return this.request.postAsync({
      qs: {
        enable: Enable,
      },
      uri: esc`node/${NodeID}/drain`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :node_id (string: <required>)- Specifies the UUID of the node. This must be the full UUID, not
  //   the short 8-character one. This is specified as part of the path.
  purgeNode({ NodeID }, callback) {
    return this.request.postAsync({
      uri: esc`node/${NodeID}/purge`,
    })
    .bind(this)
    .asCallback(callback);
  }
};
