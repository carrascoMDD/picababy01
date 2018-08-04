// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
    config.set( {
        sourcemap:                true,
        basePath:                 '',
        frameworks:               [ 'jasmine', '@angular-devkit/build-angular' ],
        plugins:                  [
            require( 'karma-jasmine' ),
            require( 'karma-chrome-launcher' ),
            require( 'karma-spec-reporter' ),
            require( 'karma-jasmine-html-reporter' ),
            require( 'karma-coverage-istanbul-reporter' ),
            require( '@angular-devkit/build-angular/plugins/karma' )
        ],
        client:                   {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        // TODO(josephperrott): Determine how to properly disable extra output on ci.
        specReporter:             {
            maxLogLines:     Infinity, // Log out the entire stack trace on errors and failures.
            suppressSkipped: true,
            showSpecTiming:  true,
        },
        coverageIstanbulReporter: {
            dir:                   require( 'path' ).join( __dirname, '../coverage' ),
            reports:               [ 'html', 'lcovonly' ],
            fixWebpackSourcePaths: true
        },
        reporters:                [ 'dots', 'progress', 'kjhtml' ],
        port:                     9876,
        colors:                   true,
        logLevel:                 config.LOG_INFO,
        autoWatch:                true,
        browsers:                 [ 'Chrome' ],
        singleRun:                false
    } );
};
