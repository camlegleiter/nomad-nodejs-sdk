import Nomad from '../nomad';
import BaseAPI from './base';

Nomad.Region = class extends BaseAPI {
  listRegions(callback) {
    return this.request.getAsync({
      uri: 'status/regions',
    })
    .bind(this)
    .asCallback(callback);
  }
};
