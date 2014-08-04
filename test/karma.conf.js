module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
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

    browsers:["Chrome"],

    autoWatch : true,

    reporters: ['progress', 'coverage'],

    logLevel: config.LOG_DEBUG,

    frameworks: ['jasmine'],

    captureTimeout: 60000,

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
