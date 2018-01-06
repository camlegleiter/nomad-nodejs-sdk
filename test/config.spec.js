import { expect } from 'chai';
import forOwn from 'lodash/forOwn';

import Nomad from '../src';

describe('Nomad.Config', () => {
  describe('#constructor', () => {
    it('sets defaults when none are provided', () => {
      const config = new Nomad.Config();

      forOwn(config.defaults, (value, key) => {
        expect(config[key]).to.equal(value);
      });
    });

    it('overrides default values when set', () => {
      const config = new Nomad.Config({ json: false });

      const original = config.defaults.json;
      expect(config.json).to.not.equal(original);
    });

    it('ignores unknown properties', () => {
      const unknownProp = 'foo';

      const config = new Nomad.Config({ [unknownProp]: 'bar' });

      expect(config).to.not.have.own.property(unknownProp);
    });
  });

  describe('#set', () => {
    const prop = 'foo';
    let config;

    beforeEach(() => {
      config = new Nomad.Config();
    });

    it('adds a key-value pair when both are defined', () => {
      const val = 'bar';
      config.set(prop, val);

      expect(config).to.have.own.property(prop, val);
    });

    it('uses the default value when value is undefined', () => {
      const defaultVal = 'bar';
      config.set(prop, undefined, defaultVal);

      expect(config).to.have.own.property(prop, defaultVal);
    });

    it('is a no-op when neither values are defined', () => {
      config.set(prop);

      expect(config).to.not.have.own.property(prop);
    });
  });

  describe('#update', () => {
    let config;

    beforeEach(() => {
      config = new Nomad.Config();
    });

    it('ignores unknown properties by default', () => {
      const unknownProp = 'foo';

      config.update({ [unknownProp]: 'bar' });

      expect(config).to.not.have.own.property(unknownProp);
    });

    it('allows unknown properties when allowUnknown is set', () => {
      const unknownProp = 'foo';

      config.update({ [unknownProp]: 'bar' }, true);

      expect(config).to.have.own.property(unknownProp);
    });

    it('updates existing properties', () => {
      const original = config.json;

      config.update({ json: false });

      expect(config.json).to.not.equal(original);
    });
  });

  describe('#clear', () => {
    it('removes all config vaules', () => {
      const config = new Nomad.Config();

      config.clear();

      forOwn(config.defaults, (value, key) => {
        expect(config).to.not.have.own.property(key);
      });
    });
  });
});
