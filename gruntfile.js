module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json'),
        isDev = process.env.NODE_ENV !== 'production',
        srcFiles = ['src/**/*.js', '!src/**/test/*_tests.js'],
        testFiles = ['src/**/test/*_tests.js'],
        lintFiles = ['gruntfile.js'].concat(srcFiles, testFiles),
        jsonFiles = ['.jshintrc', './**/*.json'],
        gruntConfig = {pkg: pkg},
        npmTasks = [];

};
