const BaseAPI = require('./base');
const Nomad = require('../nomad');

Nomad.System = class extends BaseAPI {
  forceGC(callback) {
    return this.request.putAsync({
      uri: 'system/gc',
    })
    .bind(this)
    .asCallback(callback);
  }

  reconcileSummaries(callback) {
    return this.request.putAsync({
      uri: 'system/reconcile/summaries',
    })
    .bind(this)
    .asCallback(callback);
  }
};
