const Promise = require('bluebird');
const esc = require('url-escape-tag');

const BaseAPI = require('./base');
const Nomad = require('../nomad');

Nomad.Namespace = class extends BaseAPI {
  // prefix (string: "") - Specifies a string to filter namespaces on based on an index prefix. This
  //   is specified as a querystring parameter.
  listNamespaces(...args) {
    // { Prefix }, callback
    return Promise.try(() => {
      const [[{ Prefix = '' } = {}], callback] = BaseAPI.spread(...args);

      const qs = {};
      if (Prefix != null && Prefix !== '') {
        qs.prefix = Prefix;
      }

      return this.request.getAsync({
        qs,
        uri: 'namespaces',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // :namespace (string: <required>)- Specifies the namespace to query.
  readNamespace({ Namespace }, callback) {
    return this.request.getAsync({
      uri: esc`namespace/${Namespace}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // Namespace (string: <required>)- Specifies the namespace to create or update.
  // Description (string: "") - Specifies an optional human-readable description of the namespace.
  createNamespace({ Namespace, Description = '' }, callback) {
    return Promise.try(() => {
      const body = { Namespace };
      if (typeof Description === 'string' && Description !== '') {
        body.Description = Description;
      }

      return this.request.postAsync({
        body,
        uri: 'namespace',
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // Namespace (string: <required>)- Specifies the namespace to create or update.
  // Description (string: "") - Specifies an optional human-readable description of the namespace.
  updateNamespace({ Namespace, Description = '' }, callback) {
    return Promise.try(() => {
      const body = { Namespace };
      if (Description !== undefined && Description !== '') {
        body.Description = Description;
      }

      return this.request.postAsync({
        body,
        uri: esc`namespace/${Namespace}`,
      })
      .bind(this)
      .asCallback(callback);
    });
  }

  // :namespace (string: <required>)- Specifies the namespace to delete.
  deleteNamespace({ Namespace }, callback) {
    return this.request.deleteAsync({
      uri: esc`namespace/${Namespace}`,
    })
    .bind(this)
    .asCallback(callback);
  }
};
