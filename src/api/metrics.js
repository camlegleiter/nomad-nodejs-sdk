import Promise from 'bluebird';

import Nomad from '../nomad';
import BaseAPI from './base';

Nomad.Metrics = class extends BaseAPI {
  // format (string: "") - Specifies the metrics format to be other than the JSON default.
  //   Currently, only prometheus is supported as an alterntaive format. This is specified as a
  //   querystring parameter.
  getMetrics(...args) {
    // { Format = '' } = {}, callback
    return Promise.try(() => {
      const vals = BaseAPI.spread(...args);
      const [[{ Format = '' } = {}], callback] = vals;

      const qs = {};
      if (Format != null && Format !== '') {
        qs.format = Format;
      }

      return this.request.getAsync({
        qs,
        uri: 'metrics',
      })
      .bind(this)
      .asCallback(callback);
    });
  }
};
