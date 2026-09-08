module.exports = {
  default: {
    require: ['src/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress'],
    paths: ['tests/duplicate-email.feature'],
    publishQuiet: true,
  },
};
