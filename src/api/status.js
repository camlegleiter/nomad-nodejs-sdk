import Nomad from '../nomad';
import BaseAPI from './base';

Nomad.Status = class extends BaseAPI {
  readLeader(callback) {
    return this.request.getAsync({
      uri: 'status/leader',
    })
    .bind(this)
    .asCallback(callback);
  }

  listPeers(callback) {
    return this.request.getAsync({
      uri: 'status/peers',
    })
    .bind(this)
    .asCallback(callback);
  }
};
