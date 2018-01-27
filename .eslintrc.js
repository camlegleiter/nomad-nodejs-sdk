module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import',
  ],
  env: {
    'node': true,
    'es6': true,
  },
  parserOptions: {
    ecmaVersion: 2017,
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    curly: ['error', 'all'],
    indent: ['error', 2, {
      MemberExpression: 'off',
    }],
    'object-curly-newline': ['error', { 'consistent': true }],
    'no-param-reassign': ['error'],
  }
};
