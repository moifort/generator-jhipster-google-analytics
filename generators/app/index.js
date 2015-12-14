'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'google-analytics'};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.generators.Base.extend({

    templates: function () {
        this.composeWith('jhipster:modules', {
            options: {
                jhipsterVar: jhipsterVar, jhipsterFunc: jhipsterFunc
            }
        });
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the ' + chalk.red('JHipster Google Analytics') + ' generator!'
        ));

        var prompts = [
            {
                type: 'checkbox',
                name: 'modules',
                message: 'Which module do you like to install on your JHipster application?',
                choices: [
                    {name: 'Install all modules', value: 'all'},
                    {name: 'Font Awesome', value: 'fontAwesome'},
                    {name: 'Awesome Bootstrap Checkbox (+Font Awesome)', value: 'awesomeBootstrapCheckbox'},
                    {name: 'NGSwitchery', value: 'switchery'},
                    {name: 'Angular Bootstrap Slider', value: 'angularBootstrapSlider'}
                ],
                default: 'none'
            }
        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            // To access props later use this.props.someOption;

            done();
        }.bind(this));
    },

    writing: function () {
        var done = this.async();

        this.baseName = jhipsterVar.baseName;
        this.packageName = jhipsterVar.packageName;
        this.angularAppName = jhipsterVar.angularAppName;
        this.modules = this.props.modules;

        jhipsterFunc.addBowerDependency('angular-google-analytics', '1.1.4');
        jhipsterFunc.addAngularJsModule('angular-google-analytics');

        var config = "AnalyticsProvider.setAccount('UA-32687734-5');\n" +
            "AnalyticsProvider.trackPages(true);\n" +
            "AnalyticsProvider.setDomainName('alantaya.com');\n" +
            "AnalyticsProvider.setPageEvent('$stateChangeSuccess');\n" +
            "AnalyticsProvider.useCrossDomainLinker(true);\n" +
            "AnalyticsProvider.setCrossLinkDomains(['alantaya.com']);";
        jhipsterFunc.addAngularJsConfig(['AnalyticsProvider'], config, 'Google analytics configuration');

        done();
    },

    install: function () {
        this.frontendBuilder = jhipsterVar.frontendBuilder;
        var injectDependenciesAndConstants = function () {
            switch (this.frontendBuilder) {
                case 'gulp':
                    this.spawnCommand('gulp', ['ngconstant:dev', 'wiredep:test', 'wiredep:app']);
                    break;
                case 'grunt':
                default:
                    this.spawnCommand('grunt', ['ngconstant:dev', 'wiredep']);
            }
        };

        this.installDependencies({
                callback: injectDependenciesAndConstants.bind(this)
            }
        );
    }
});

