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

        var questions = 2;

        var prompts = [
            {
                type: 'input',
                name: 'googleAnalyticsId',
                validate: function (input) {
                    if (/(UA|YT|MO)-\d+-\d+/i.test(input)) return true;
                    return 'Hum! Strange, it\'s didn\'t look like to a Google analytics tracking ID, normaly it\'s like \'UA-12345678-9\'';
                },
                message: '(1/' + questions + ') What is your Google analytics tracking ID?'
            },
            {
                type: 'input',
                name: 'domainName',
                validate: function (input) {
                    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(input)) return true;
                    return 'Bizarre, it\'s didn\'t look like to a domain name, normaly it\'s like \'mydomainname.com\'';
                },
                message: '(2/' + questions + ') What is the domain name of your application?'
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
        this.frontendBuilder = jhipsterVar.frontendBuilder;

        this.googleAnalyticsId = this.props.googleAnalyticsId;
        this.domainName = this.props.domainName;

        jhipsterFunc.addBowerDependency('angular-google-analytics', '1.1.4');
        jhipsterFunc.addAngularJsModule('angular-google-analytics');

        var config = "AnalyticsProvider.setAccount('"+this.googleAnalyticsId+"');\n" +
            "AnalyticsProvider.trackPages(true);\n" +
            "AnalyticsProvider.setDomainName('"+this.domainName+"');\n" +
            "AnalyticsProvider.setPageEvent('$stateChangeSuccess');\n" +
            "AnalyticsProvider.useCrossDomainLinker(true);\n" +
            "AnalyticsProvider.setCrossLinkDomains(['"+this.domainName+"']);";

        jhipsterFunc.addAngularJsConfig(['AnalyticsProvider'], config, 'Google analytics configuration');

        done();
    },

    install: function () {
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

