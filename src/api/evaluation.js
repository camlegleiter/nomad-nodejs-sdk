import Promise from 'bluebird';
import esc from 'url-escape-tag';

import Nomad from '../nomad';
import BaseAPI from './base';

Nomad.Evaluation = class extends BaseAPI {
  // prefix (string: "")- Specifies a string to filter evaluations on based on an index prefix. This
  //   is specified as a querystring parameter.
  listEvaluations(...args) {
    // { Prefix }, callback
    return Promise.try(() => {
      const [[{ Prefix = '' } = {}], callback] = BaseAPI.spread(...args);

      const qs = {};
      if (Prefix !== undefined && Prefix !== '') {
        qs.prefix = Prefix;
      }

      return this.request.getAsync({
        qs,
        uri: 'evaluations',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // :eval_id (string: <required>)- Specifies the UUID of the evaluation. This must be the full
  //   UUID, not the short 8-character one. This is specified as part of the path.
  readEvaluation({ EvaluationID }, callback) {
    return this.request.getAsync({
      uri: esc`evaluation/${EvaluationID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // :eval_id (string: <required>)- Specifies the UUID of the evaluation. This must be the full
  //   UUID, not the short 8-character one. This is specified as part of the path.
  listAllocations({ EvaluationID }, callback) {
    return this.request.getAsync({
      uri: esc`evaluation/${EvaluationID}/allocations`,
    })
    .bind(this)
    .asCallback(callback);
  }
};
