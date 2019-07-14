const Nomad = require('../nomad');
const BaseAPI = require('./base');

Nomad.Validate = class extends BaseAPI {
  validateJob({ Job }, callback) {
    return this.request.postAsync({
      body: Job,
      uri: 'validate/job',
    })
    .bind(this)
    .asCallback(callback);
  }
};
