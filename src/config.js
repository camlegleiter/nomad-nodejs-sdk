import forOwn from 'lodash/forOwn';
import has from 'lodash/has';

import Nomad from './nomad';

Nomad.Config = class {
  constructor(options) {
    this.defaults = {
      strictSSL: true,
      json: true,
      host: 'http://localhost:4646',
      token: null,
      pretty: false,
    };

    const userOpts = options || {};

    forOwn(this.defaults, (value, key) => {
      this.set(key, userOpts[key], value);
    });
  }

  set(key, value, defaultValue) {
    if (value === undefined) {
      if (defaultValue !== undefined) {
        this[key] = defaultValue;
      }
    } else {
      this[key] = value;
    }
  }

  update(options, allowUnknown = false) {
    forOwn(options, (value, key) => {
      if (allowUnknown || has(this.defaults, key)) {
        this.set(key, value);
      }
    });
  }

  clear() {
    forOwn(this.defaults, (value, key) => {
      delete this[key];
    });
  }
};

Nomad.config = new Nomad.Config();
