'use strict';
var grunt = require('grunt'),
    yeoman = require('yeoman');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        this.pkg = require('../package.json');
    },

    prompting: function() {
        var done = this.async(),
            prompts,
            self = this;

        this.log(this.yeoman);
        this.log(
            'I am the Ambition generator! ' +
            'Please select some options and I will do some generating for your project.'
        );

        prompts = [{
            name: 'projectName',
            message: 'What would you like to call your project?'
        }, {
            type: 'checkbox',
            name: 'features',
            message: 'Please tell me more about your project.',
            choices: [{
                name: 'Does your project use ECMAScript 6?',
                value: 'es6',
                checked: false
            }, {
                name: 'Does your project use jQuery?',
                value: 'jquery',
                checked: false
            }, {
                name: 'Is there a fire inside you that cannot be extinguished?',
                value: 'fire',
                checked: true
            }]
        }];

        this.prompt(prompts, function(answers) {
            self.projectName = answers.projectName;
            self.es6 = answers.es6;
            self.jquery = answers.jquery;
            done();
        });
    },

    configuring: function() {
        this.config.save();
    },

    writing: function() {
        var projectDir = this.projectName.toLowerCase().replace(/\s/g, '-'),
            srcDir = 'src/' + projectDir,
            testDir = srcDir + '/tests';

        //make the grunt and package files
        this.template('package.json');
        this.template('gruntfile.js');

        //make the directories
        this.mkdir('src');
        this.mkdir(srcDir);
        this.mkdir(testDir);

        //make default app and app_test files
        this.write(srcDir + '/app.js', '//app.js');
        this.write(testDir + '/app_tests.js', '//app_tests.js');
    }
});
