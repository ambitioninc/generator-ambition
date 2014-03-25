module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json'),
        isDev = process.env.NODE_ENV !== 'production',<% if (browserstack) { %>
        isBrowserStack = process.env.BROWSERSTACK_KEY && process.env.BROWSERSTACK_USERNAME,<% } %>
        srcFiles = ['src/**/*.js', '!src/**/test/*_tests.js'],<% if (style) { %>
        styleFiles = ['style/**/*.styl'],<% } %>
        testFiles = ['src/**/tests/*_tests.js'],
        lintFiles = ['gruntfile.js'].concat(srcFiles, testFiles),
        jsonFiles = ['.jshintrc', '*.json'],
        gruntConfig = {pkg: pkg},
        testTasks = [],
        npmTasks = [];

    function merge() {
        var dest = arguments[0],
            srcs = Array.prototype.slice.call(arguments, 1);

        srcs.forEach(function(src) {
            Object.keys(src).forEach(function(key) {
                dest[key] = src[key];
            });
        });
    }

    function getVendorFiles() {
        var files = [];
        <% if (jquery) { %>
        files.push('lib/jquery/jquery.min.js');
        <% } %><% if (es6) { %>
        files.push('lib/traceur-runtime/traceur-runtime.min.js');
        <% } %>return files;
    }

    function addBuildTasks() {
        var uglifyConfig = {}<% if (style) { %>,
            stylusConfig = {};
        //generate the css file name
        npmTasks.push('grunt-contrib-stylus');
        stylusConfig['build/<%= projectName %>.css'] = styleFiles;

        merge(gruntConfig, {
            stylus: {
                files: stylusConfig,
                options: {
                    paths: ['./style/'],
                    import: ['nib']
                }
            }
        });

        grunt.registerTask('buildStyle', ['stylus']);
        <% } else { %>;<% } %>
        <% if (es6) { %>
        npmTasks.push('grunt-traceur-compiler');
        uglifyConfig['build/<%= projectName %>.js'] = '.tmp/src.js';
        uglifyConfig['.tmp/tests.js'] = '.tmp/tests.js';

        merge(gruntConfig, {
            traceur: {
                options: {
                    experimental: true
                },
                src: {
                    files: {
                        '.tmp/src.js': 'src/<%= projectName %>/app.js'
                    }
                },
                test: {
                    files: {
                        '.tmp/tests.js': testFiles
                    }
                }
            }
        });
        <% } else { %>
        npmTasks.push('grunt-jscs-checker');
        uglifyConfig['build/<%= projectName %>.js'] = srcFiles;

        merge(gruntConfig, {
            jscs: {
                all: lintFiles,
                options: {
                    config: '.jscs.json'
                }
            }
        });
        <% } %>
        <% if (browserstack && !es6) { %>
            uglifyConfig['.tmp/tests.js'] = testFiles;
        <% } %>
        npmTasks.push('grunt-contrib-uglify');
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
                src: <% if (es6) { %>'.tmp/tests.js'<% } else { %>srcFiles<% }%>,
                options: {
                    vendor: getVendorFiles(),<% if (!es6) { %>
                    specs: testFiles,<% } %>
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

            watch: {<% if (style) { %>
                style: {
                    files: styleFiles,
                    tasks: ['buildStyle']
                },<% } %>
                src: {
                    files: srcFiles,
                    tasks: ['buildSrc']
                }
            }
        });
    }<% if (browserstack) { %>
    function addBrowserstackTasks() {
        testTasks.push('copy');
        testTasks.push('browserstack_runner');
        npmTasks.push('browserstack-runner');
        npmTasks.push('grunt-contrib-copy');

        merge(gruntConfig, {
            'browserstack_runner': {},
            'copy': {
                jasmine: {
                    src: 'node_modules/grunt-contrib-jasmine/vendor/jasmine-1.3.1/jasmine.js',
                    dest: '.tmp/jasmine.js'
                },
                tests: {
                    src: <% if(es6) { %>'.'<% } else {%>testFiles<% } %>,
                    dest: '.tmp/tests.js'
                }
            }
        });
    }

    <% } %>
    <% if (es6) { %>
    function registerES6() {
        grunt.registerTask('buildSrc', ['traceur', 'uglify']);

        if (isDev) {
            testTasks = [
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
        grunt.registerTask('buildSrc', ['uglify']);

        if (isDev) {
            testTasks = [
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
    registerES5();<% } %><% if (browserstack) { %>

    //browserstack only
    if (isBrowserStack) {
        addBrowserstackTasks();
    }<% } %>

    //add the test tasks
    grunt.registerTask('test', testTasks);

    //add the build task
    grunt.registerTask('build', [<% if(style) { %>'buildStyle', <% } %>'buildSrc']);

    //load the tasks
    npmTasks.forEach(function(task) {
        grunt.loadNpmTasks(task);
    });
};
