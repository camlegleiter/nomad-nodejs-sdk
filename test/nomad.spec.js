import { expect } from 'chai';

import Nomad from '../src/nomad';
import pkg from '../package.json';

describe('Nomad', () => {
  describe('NAME', () => {
    it('is the same as the package.json name property', () => {
      expect(Nomad.NAME).to.equal(pkg.name);
    });
  });

  describe('VERSION', () => {
    it('is the same as the package.json version property', () => {
      expect(Nomad.VERSION).to.equal(pkg.version);
    });
  });
});
