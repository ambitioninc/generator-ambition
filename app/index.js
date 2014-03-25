'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        this.pkg = require('../package.json');
    },

    install: function() {
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
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
            name: 'options',
            message: 'Please tell me more about your project.',
            choices: [{
                name: 'Does your project use CSS?',
                value: 'style',
                checked: false
            }, {
                name: 'Does your project use jQuery?',
                value: 'jquery',
                checked: false
            }, {
                name: 'Does your project use ECMAScript 6?',
                value: 'es6',
                checked: false
            }, {
                name: 'Do you want to run tests on browserstack?',
                value: 'browserstack',
                checked: false
            }]
        }];

        this.prompt(prompts, function(answers) {
            var options = answers.options;

            self.projectName = answers.projectName.toLowerCase().replace(/\W/g, '-');
            self.browserstack = options.indexOf('browserstack') !== -1;
            self.style = options.indexOf('style') !== 1;
            self.es6 = options.indexOf('es6') !== -1;
            self.jquery = options.indexOf('jquery') !== -1;
            done();
        });
    },

    configuring: function() {
        this.config.save();
    },

    writing: function() {
        var projectDir = this.projectName,
            srcDir = 'src/' + projectDir,
            testDir = srcDir + '/tests';

        //make the grunt and package files
        this.template('package.json');
        this.template('gruntfile.js');

        //copy the lint configs
        this.copy('.jshintrc', '.jshintrc');
        this.copy('.jscs.json', '.jscs.json');

        //make the directories
        this.mkdir('src');
        this.mkdir(srcDir);
        this.mkdir(testDir);

        //make default app and app_test files
        this.write(srcDir + '/app.js', '//app.js');
        this.write(testDir + '/app_tests.js', '//app_tests.js');

        //bower
        if (this.es6 || this.jquery) {
            this.bowerDependencies = {};

            if (this.es6) {
                this.bowerDependencies['traceur-runtime'] = '>=0.0.30';
            }

            if (this.jquery) {
                this.bowerDependencies.jquery = '>=1.9.0';
            }

            this.bowerDependencies = JSON.stringify(this.bowerDependencies).replace(/,/g, ',\n  ');
            this.template('bower.json');
            this.copy('.bowerrc', '.bowerrc');
        }

        //stylus
        if (this.style) {
            this.mkdir('style');
            this.mkdir('style/variables');
            this.write('style/variables/all.styl', '');
        }

        if (this.browserstack) {
            this.template('browserstack.json');
            this.template('browserstack.html');
        }
    }
});
