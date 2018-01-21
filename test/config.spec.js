import forOwn from 'lodash/forOwn';

import Nomad from '../src';

describe('Nomad.Config', () => {
  describe('#constructor', () => {
    it('sets defaults when none are provided', () => {
      const config = new Nomad.Config();

      forOwn(config.defaults, (value, key) => {
        expect(config[key]).toBe(value);
      });
    });

    it('overrides default values when set', () => {
      const config = new Nomad.Config({ json: false });

      const original = config.defaults.json;
      expect(config.json).not.toEqual(original);
    });

    it('ignores unknown properties', () => {
      const unknownProp = 'foo';

      const config = new Nomad.Config({ [unknownProp]: 'bar' });

      expect(config).not.toHaveProperty(unknownProp);
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

      expect(config).toHaveProperty(prop, val);
    });

    it('uses the default value when value is undefined', () => {
      const defaultVal = 'bar';
      config.set(prop, undefined, defaultVal);

      expect(config).toHaveProperty(prop, defaultVal);
    });

    it('is a no-op when neither values are defined', () => {
      config.set(prop);

      expect(config).not.toHaveProperty(prop);
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

      expect(config).not.toHaveProperty(unknownProp);
    });

    it('allows unknown properties when allowUnknown is set', () => {
      const unknownProp = 'foo';

      config.update({ [unknownProp]: 'bar' }, true);

      expect(config).toHaveProperty(unknownProp);
    });

    it('updates existing properties', () => {
      const original = config.json;

      config.update({ json: false });

      expect(config.json).not.toEqual(original);
    });
  });

  describe('#clear', () => {
    it('removes all config vaules', () => {
      const config = new Nomad.Config();

      config.clear();

      forOwn(config.defaults, (value, key) => {
        expect(config).not.toHaveProperty(key);
      });
    });
  });
});
