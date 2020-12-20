module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'prettier'
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-unused-vars': 'off'
  },
}
