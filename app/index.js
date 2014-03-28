'use strict';
var yeoman = require('yeoman-generator'),
    rimraf = require('rimraf'),
    fs = require('fs');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        var self = this;
        self.pkg = require('../package.json');
        self.traceurVersion = '0.0.31';

        self.on('end', function() {
            var done = self.async(),
                cleanup = function cleanup() {
                    if (self.jquery) {
                        fs.writeFileSync(self.destinationRoot() + '/lib/jquery/jquery.js', self.readFileAsString(
                            'lib/jquery/dist/jquery.js'
                        ));
                        fs.writeFileSync(self.destinationRoot() + '/lib/jquery/jquery.min.js', self.readFileAsString(
                            'lib/jquery/dist/jquery.min.js'
                        ));
                        fs.writeFileSync(self.destinationRoot() + '/lib/jquery/jquery.min.map', self.readFileAsString(
                            'lib/jquery/dist/jquery.min.map'
                        ));

                        rimraf.sync(self.destinationRoot() + '/lib/jquery/dist');
                        rimraf.sync(self.destinationRoot() + '/lib/jquery/src');
                    }
                    done();
                };

            self.installDependencies({
                skipInstall: self.options['skip-install'],
                callback: cleanup
            })
        });

        self.on('dependenciesInstalled', function() {
            self.spawnCommand('grunt', ['build']);
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
                name: 'Does your project use Stylus?',
                value: 'stylus',
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
                name: 'Do you want to run tests on Browserstack?',
                value: 'browserstack',
                checked: false
            }, {
                name: 'Do you want to exlcude JavaScript from your project?',
                value: 'noJS',
                checked: false
            }]
        }];

        function getProjectName() {
            self.prompt(prompts.slice(0, 1), function(answers) {
                self.projectName = answers.projectName.toLowerCase().replace(/\W/g, '-');

                if (!self.projectName) {
                    getProjectName();
                } else {
                    getProjectOptions();
                }
            });
        }

        function getProjectOptions() {
            self.prompt(prompts.slice(1), function(answers) {
                var options = answers.options,
                    hasOption = function hasOption(option) {
                        return options.indexOf(option) !== -1;
                    };

                self.es6 = hasOption('es6');
                self.es5 = !hasOption('noJS') && !self.es6;
                self.jquery = hasOption('jquery') && (self.es5 || self.es6);
                self.browserstack = hasOption('browserstack') && (self.es5 || self.es6);
                self.stylus = hasOption('stylus');

                done();
            });
        }

        //start the prompts
        getProjectName();
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

        //copy the common configs
        this.copy('.editorconfig', '.editorconfig');

        //make common directories
        this.mkdir('build');

        if (this.es5 || this.es6) {
            //js files
            this.copy('.jshintrc', '.jshintrc');
            this.copy('.jscs.json', '.jscs.json');
            this.template('app.js', srcDir + '/app.js');
            this.template('app_tests.js', testDir + '/app_tests.js');
            this.mkdir('src');
            this.mkdir(srcDir);
            this.mkdir(testDir);

            //bower
            if (this.es6 || this.jquery) {
                this.bowerDependencies = {};

                if (this.es6) {
                    this.bowerDependencies['traceur-runtime'] = '>=' + this.traceurVersion;
                }

                if (this.jquery) {
                    this.bowerDependencies.jquery = '>=1.9.0';
                }

                this.bowerDependencies = JSON.stringify(this.bowerDependencies).replace(/,/g, ',\n  ');
                this.template('bower.json');
                this.copy('.bowerrc', '.bowerrc');
            }

            //browserstack
            if (this.browserstack) {
                this.template('browserstack.json');
                this.template('browserstack.html');
            }
        }

        //stylus
        if (this.stylus) {
            this.mkdir('style');
            this.mkdir('style/variables');
            this.write('style/variables/all.styl', '');
            this.write('build/' + this.projectName + '.css', '');
        }
    }
});
