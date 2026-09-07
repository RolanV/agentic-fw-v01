module.exports = {
  default: {
    require: ['src/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'html:reports/cucumber-report.html'],
    formatOptions: {
      snippetInterface: 'async-await',
    },
    paths: ['tests/**/*.feature'],
    publishQuiet: true,
  },
};
