const Promise = require('bluebird');
const esc = require('url-escape-tag');

const BaseAPI = require('./base');
const Nomad = require('../nomad');

Nomad.Allocation = class extends BaseAPI {
  // prefix (string: "")- Specifies a string to filter allocations on based on an index prefix. This
  //   is specified as a querystring parameter.
  //   must contain valid UUID characters
  listAllocations(...args) {
    // { Prefix }, callback
    return Promise.try(() => {
      const [[{ Prefix = '' } = {}], callback] = BaseAPI.spread(...args);

      const qs = {};
      if (Prefix !== undefined && Prefix !== '') {
        qs.prefix = Prefix;
      }

      return this.request.getAsync({
        qs,
        uri: 'allocations',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // AllocationID (string: <required>)- Specifies the UUID of the allocation. This must be the full
  //   UUID, not the short 8-character one. This is specified as part of the path.
  readAllocation({ AllocationID }, callback) {
    return this.request.getAsync({
      uri: esc`allocation/${AllocationID}`,
    })
    .bind(this)
    .asCallback(callback);
  }
};
