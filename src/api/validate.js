import Nomad from '../nomad';
import BaseAPI from './base';

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
