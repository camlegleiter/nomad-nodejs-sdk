import Promise from 'bluebird';

import Nomad from '../nomad';
import BaseAPI from './base';

Nomad.Operator = class extends BaseAPI {
  // stale - Specifies if the cluster should respond without an active leader. This is specified as
  //   a querystring parameter.
  readRaftConfiguration(...args) {
    // { Stale }, callback
    return Promise.try(() => {
      const [[{ Stale = false } = {}], callback] = BaseAPI.spread(...args);

      const qs = {};
      if (Stale) {
        qs.stale = null;
      }

      return this.request.getAsync({
        qs,
        qsStringifyOptions: {
          strictNullHandling: true,
        },
        uri: 'operator/raft/configuration',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // address (string: <required>) - Specifies the server to remove as ip:port. This may be provided
  //   multiple times and is provided as a querystring parameter.
  // stale - Specifies if the cluster should respond without an active leader. This is specified as
  //   a querystring parameter.
  removeRaftPeer({ Address, Stale = false }, callback) {
    return Promise.try(() => {
      const qs = {
        address: Array.isArray(Address) ? Address : [Address],
      };
      if (Stale) {
        qs.stale = null;
      }

      return this.request.deleteAsync({
        qs,
        qsStringifyOptions: {
          strictNullHandling: true,
          arrayFormat: 'repeat',
        },
        uri: 'operator/raft/peer',
      })
      .bind(this)
      .asCallback(callback);
    });
  }
};
