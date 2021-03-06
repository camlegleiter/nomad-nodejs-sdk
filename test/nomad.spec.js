const Nomad = require('../src/nomad');
const pkg = require('../package.json');

describe('Nomad', () => {
  describe('NAME', () => {
    it('is the same as the package.json name property', () => {
      expect(Nomad.NAME).toBe(pkg.name);
    });
  });

  describe('VERSION', () => {
    it('is the same as the package.json version property', () => {
      expect(Nomad.VERSION).toBe(pkg.version);
    });
  });
});
