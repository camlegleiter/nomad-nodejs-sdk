import Promise from 'bluebird';
import esc from 'url-escape-tag';

import Nomad from '../nomad';
import BaseAPI from './base';

Nomad.Quota = class extends BaseAPI {
  // prefix (string: "")- Specifies a string to filter quota specifications on based on an index
  //   prefix. This is specified as a querystring parameter.
  listQuotaSpecifications(...args) {
    // { Prefix }, callback
    return Promise.try(() => {
      const [[{ Prefix = '' } = {}], callback] = BaseAPI.spread(...args);

      const qs = {};
      if (Prefix != null && Prefix !== '') {
        qs.prefix = Prefix;
      }

      return this.request.getAsync({
        qs,
        uri: 'quotas',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // :quota (string: <required>)- Specifies the quota specification to query where the identifier is
  //   the quota's name.
  readQuotaSpecification({ Name }, callback) {
    return this.request.getAsync({
      uri: esc`quota/${Name}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // The request body contains a valid, JSON quota specification. View the api package to see the
  //   definition of a [QuotaSpec](https://github.com/hashicorp/nomad/blob/master/api/quota.go#L100-L131)
  //   object.
  createQuotaSpecification({ Quota }, callback) {
    return this.request.postAsync({
      body: Quota,
      uri: 'quota',
    })
    .bind(this)
    .asCallback(callback);
  }

  // The request body contains a valid, JSON quota specification. View the api package to see the
  //   definition of a [QuotaSpec](https://github.com/hashicorp/nomad/blob/master/api/quota.go#L100-L131)
  //   object.
  updateQuotaSpecification({ Quota }, callback) {
    return Promise.try(() => {
      const { Name } = Quota;

      return this.request.postAsync({
        body: Quota,
        uri: esc`quota/${Name}`,
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // :quota (string: <required>)- Specifies the quota specification to delete where the identifier
  //   is the quota's name.
  deleteQuotaSpecification({ Name }, callback) {
    return this.request.deleteAsync({
      uri: esc`quota/${Name}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // prefix (string: "")- Specifies a string to filter quota specifications on based on an index
  //   prefix. This is specified as a querystring parameter.
  listQuotaUsages(...args) {
    // { Prefix }, callback
    return Promise.try(() => {
      const [[{ Prefix = '' } = {}], callback] = BaseAPI.spread(...args);

      const qs = {};
      if (Prefix != null && Prefix !== '') {
        qs.prefix = Prefix;
      }

      return this.request.getAsync({
        qs,
        uri: 'quota-usages',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // :quota (string: <required>)- Specifies the quota specification to query where the identifier is
  //   the quota's name.
  readQuotaUsage({ Name }, callback) {
    return this.request.getAsync({
      uri: esc`quota/usage/${Name}`,
    })
    .bind(this)
    .asCallback(callback);
  }
};
