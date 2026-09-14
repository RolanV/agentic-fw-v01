module.exports = {
  default: {
    require: ['hooks/**/*.ts', 'steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'html:reports/cucumber-report.html'],
    formatOptions: {
      snippetInterface: 'async-await',
    },
    paths: ['features/**/*.feature'],
    publishQuiet: true,
  },
};
