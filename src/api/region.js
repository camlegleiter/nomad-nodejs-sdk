const BaseAPI = require('./base');
const Nomad = require('../nomad');

Nomad.Region = class extends BaseAPI {
  listRegions(callback) {
    return this.request.getAsync({
      uri: 'status/regions',
    })
    .bind(this)
    .asCallback(callback);
  }
};
