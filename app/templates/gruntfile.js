module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json'),
        isDev = process.env.NODE_ENV !== 'production',<% if (browserStack) { %>
        isBrowserStack = process.env.BROWSERSTACK_KEY && process.env.BROWSERSTACK_USERNAME,<% } %>
        srcFiles = ['src/**/*.js', '!src/**/test/*_tests.js'],
        <% if (style) { %>
        styleFiles = ['style/**/*.styl'], <% } %>
        testFiles = ['src/**/test/*_tests.js'],
        lintFiles = ['gruntfile.js'].concat(srcFiles, testFiles),
        jsonFiles = ['.jshintrc', './**/*.json'],
        gruntConfig = {pkg: pkg},
        testTasks = [],
        npmTasks = [];

    function merge() {
        var dest = Array.prototype.slice.call(arguments, 0, 1),
            srcs = Array.prototype.slice.call(arguments, 1);

        srcs.forEach(function(src) {
            src.keys().forEach(function(key) {
                dest[key] = src[key];
            });
        });
    }

    function getVendorFiles() {
        var files = [];
        <% if (jquery) { %>
            files.push('lib/jquery/jquery.min.js');
        <% } %><% if (es6) { %>
            files.push('lib/traceur/traceur-runtime.min.js');
        <% } %>return files;
    }

    function addBuildTasks() {
        var stylusConfig = {},
            uglifyConfig = {};

        npmTasks.push('grunt-contrib-stylus');
        npmTasks.push('grunt-contrib-uglify');
        <% if (style) { %>
        //generate the css file name
        stylusConfig['build/<%= projectName %>.css'] = styleFiles;

        merge(gruntConfig, {
            stylus: {
                files: stylusConfig,
                options: {
                    paths: ['./style/'],
                    import: ['nib']
                }
            }
        );
        <% } %>
        //generate the uglify file names
        uglifyConfig['build/<%= projectName %>.js'] = jsFiles;
        <% if (es6) { %>
        npmTasks.push('grunt-traceur-compiler');

        merge(gruntConfig, {
            traceur: {
                options: {
                    experimental: true
                },
                src: {
                    '.tmp/tmp-src.js': 'src/<%= projectName %>/app.js'
                },
                test: {
                    '.tmp/tmp-test.js': testFiles
                }
            }
        });

        uglifyConfig['.tmp/' + 'tmp-test.min' + '.js'] = '.tmp/tmp-test.js';
        <% } else { %>
        npmTasks.push('grunt-jscs-checker');

        merge(gruntConfig, {
            jscs: {
                all: lintFiles,
                options: {
                    config: '.jscs.json'
                }
            }
        });
        <% } %>
        merge(gruntConfig, {
            uglify: {
                compile: {
                    files: uglifyConfig
                }
            }
        });
    }

    function addDevTasks() {
        npmTasks.push('grunt-contrib-jasmine');
        npmTasks.push('grunt-contrib-jshint');
        npmTasks.push('grunt-contrib-watch');
        npmTasks.push('grunt-jsonlint');

        merge(gruntConfig, {
            jasmine: {
                src: <% if (this.es6) { %> '.tmp/tmp-test.min.js' <% } else { %> srcFiles <% }%>,
                options: {
                    vendor: getVendorFiles(),
                    <% if (!this.es6) { %>specs: testFiles, <% } %>
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: '.tmp/coverage.json',
                        report: [{type: 'text-summary'}],
                        thresholds: {
                            lines: 100,
                            statements: 100,
                            branches: 100,
                            functions: 100
                        }
                    }
                }
            },

            jshint: {
               test: lintFiles,
                options: {
                    jshintrc: '.jshintrc'
                }
            },

            jsonlint: {
                test: {
                    src: jsonFiles
                }
            },

            watch: {
                style: {
                    files: styleFiles,
                    tasks: ['buildStyle']
                },
                src: {
                    files: srcFiles,
                    tasks: ['buildSrc']
                }
            }
        });
    }<% if (browserStack) { %>
    function addBrowserStackTasks() {
        teskTasks.push('browserstack_runner');
        npmTasks.push('browserstack-runner');
        npmTasks.push('copy');

        merge(gruntConfig, {
            'browserstack_runner': {},
            'copy': {
                jasmine: {
                    src: 'node_modules/grunt-contrib-jasmine/vendor/jasmine-1.3.1/jasmine.js',
                    dest: '.tmp/jasmine.js'
                },
                tests: {
                    src: testFiles,
                    dest: '.tmp/tests.js'
                }
            }
        }
    }

    <% } %>
    <% if (es6) { %>
    function registerES6() {
        grunt.registerTask('buildStyle', ['stylus']);
        grunt.registerTask('buildSrc', ['copy', 'traceur', 'uglify']);
        grunt.registerTask('build', ['buildStyle', 'buildSrc']);

        if (isDev) {
            teskTasks = [
                'jsonlint',
                'jshint',
                'build',
                'jasmine'
            ];
            grunt.registerTask('default', ['watch']);
        }
    }
    <% } else { %>
    function registerES5() {
        var testTasks;

        grunt.registerTask('buildStyle', ['stylus']);
        grunt.registerTask('buildSrc', ['uglify']);
        grunt.registerTask('build', ['buildStyle', 'buildSrc']);

        if (isDev) {
            teskTasks = [
                'jsonlint',
                'jshint',
                'jscs',
                'build',
                'jasmine'
            ];
        }
    }
    <% } %>
    //development only
    if (isDev) {
        addDevTasks();
    }

    //always add build tasks
    addBuildTasks();

    //initialize the build configuration
    grunt.initConfig(gruntConfig);
    <% if (es6) { %>
    registerES6();<% } else { %>
    resgisterES5();<% } %><% if (browserStack) { %>

    //browserstack only
    if (isBrowserStack) {
        addBrowerstackTasks();
    }<% } %>
    //add the test tasks
    grunt.registerTask('test', testTasks);
};
