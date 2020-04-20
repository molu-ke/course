// Karma configuration
// Generated on Sun Nov 17 2019 23:00:24 GMT+0800 (GMT+08:00)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // 使用换测试框架，如mocha chai
    frameworks: ['mocha','chai'],


    // 浏览器中加载的文件，支持正则
    files: [
      './resp.js',
      './resp.test.js',
    ],

    // 为文件指定预处理器 如webpack  babel
    preprocessors: {
      './resp.js':['webpack'],
      './resp.test.js':['webpack']
    },

    // list of files / patterns to exclude
    exclude: [
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress','coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // 使用的插件，如karma-webpack等
    plugins:[
      'karma-webpack',
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-chai'
    ],

    webpack:require('./webpack.test.config'),

    webpackMinddlerare:{
      noInfo:true
    },

    coverageReporter: {
      dir:'dist/coverage/',
      reporters:[
        {type:'html',subdir:'report-html'},
        {type:'lcovonly',subdir:'.',file:'report-lcovonly.txt'},
        {type:'text-summary',subdir:'.',file:'text-summary.txt'},
      ]
    },

    // 需要测试的浏览器，需要配置对应的插件
    browsers: ['Chrome', 'PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
