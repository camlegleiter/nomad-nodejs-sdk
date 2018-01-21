module.exports = {
  extends: '../.eslintrc.js',
  plugins: [
    'jest',
  ],
  env: {
    jest: true,
  },
  globals: {
    expect: true,
  },
  rules: {
    'no-unused-expressions': 0,
    'jest/no-focused-tests': 2,
    'jest/no-identical-title': 2,
  }
};
