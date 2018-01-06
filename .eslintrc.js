module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import',
    'mocha',
  ],
  env: {
    'node': true,
    'es6': true,
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    curly: ['error', 'all'],
    indent: ['error', 2, {
      MemberExpression: 0,
    }],
    'object-curly-newline': ['error', { 'consistent': true }],
    'no-param-reassign': ['error'],
    'mocha/no-exclusive-tests': 'error',
  }
};
