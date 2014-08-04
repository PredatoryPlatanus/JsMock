module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'ext/angular.js',
      'ext/angular-mocks.js',
      'testables/testApp.js',
      'src/*.js',
      'test/unit/**/*.js'
    ],

// preprocessors: {
//   'src/*.js': ['coverage']
// },

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    autoWatch : true,

    reporters: ['progress', 'coverage'],

    logLevel: config.LOG_DEBUG,

    browsers: ['Chrome'],

    frameworks: ['jasmine'],

    captureTimeout: 60000,

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
