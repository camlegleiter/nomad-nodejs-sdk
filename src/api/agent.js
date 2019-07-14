const BaseAPI = require('./base');
const Nomad = require('../nomad');

Nomad.Agent = class extends BaseAPI {
  listMembers(callback) {
    return this.request.getAsync({
      uri: 'agent/members',
    })
    .bind(this)
    .asCallback(callback);
  }

  listServers(callback) {
    return this.request.getAsync({
      uri: 'agent/servers',
    })
    .bind(this)
    .asCallback(callback);
  }

  // address (string|array<string>: <required>) - Specifies the list of addresses in the format
  //   ip:port.
  updateServers({ Address }, callback) {
    return Promise.try(() => {
      const addresses = Array.isArray(Address) ? Address : [Address];

      return this.request.postAsync({
        qs: {
          address: addresses,
        },
        useQuerystring: true,
        uri: 'agent/servers',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  querySelf(callback) {
    return this.request.getAsync({
      uri: 'agent/self',
    })
    .bind(this)
    .asCallback(callback);
  }

  // address (string|array<string>: <required>) - Specifies the address to join in the ip:port
  //   format. This is provided as a query parameter and may be specified multiple times to join
  //   multiple servers.
  joinAgent({ Address }, callback) {
    return Promise.try(() => {
      const addresses = Array.isArray(Address) ? Address : [Address];

      return this.request.postAsync({
        qs: {
          address: addresses,
        },
        useQuerystring: true,
        uri: 'agent/join',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // node (string: <required>) - Specifies the name of the node to force leave.
  forceLeaveAgent({ Node }, callback) {
    return this.request.postAsync({
      qs: {
        node: Node,
      },
      uri: '/agent/force-leave',
    })
    .bind(this)
    .asCallback(callback);
  }

  agentHealth(callback) {
    return this.request.getAsync({
      uri: 'agent/health',
    })
    .bind(this)
    .asCallback(callback);
  }
};
