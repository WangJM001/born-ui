module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    'no-confusing-arrow': 0,
  },
};
