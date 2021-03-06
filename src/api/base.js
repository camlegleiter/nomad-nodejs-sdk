const Promise = require('bluebird');
const defaultsDeep = require('lodash/defaultsDeep');
const last = require('lodash/last');
const dropRight = require('lodash/dropRight');
const isFunction = require('lodash/isFunction');
const request = require('request');

const Nomad = require('../nomad');

module.exports = class BaseAPI {
  constructor(options) {
    this.config = new Nomad.Config(Nomad.config);
    this.config.update(options);

    // "pretty" is a supported API query arg, but it doesn't make sense here
    const { host, token } = this.config;

    this.request = Promise.promisifyAll(request.defaults(defaultsDeep({
      baseUrl: `${host}/v1/`,
      headers: {
        'User-Agent': `${Nomad.NAME}/${Nomad.VERSION}`,
        'X-Nomad-Token': token,
      },
    }, this.config)), { multiArgs: true });
  }

  static spread(...args) {
    const l = last(args);

    let callback;
    if (isFunction(l)) {
      callback = l;
      return [dropRight(args), callback];
    }
    return [args];
  }
}
