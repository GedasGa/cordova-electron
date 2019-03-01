/* eslint-disable no-template-curly-in-string */
/*
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

const rewire = require('rewire');
const path = require('path');
const Api = rewire('../../../../../../bin/templates/cordova/Api');

fdescribe('Testing build.js:', () => {
    let build;

    beforeEach(() => {
        build = rewire('../../../../../../bin/templates/cordova/lib/build');
    });

    describe('deepMerge method', () => {
        // deepMerge (mergeTo, mergeWith)
    });

    describe('Build class', () => {
        let ElectronBuilder;
        let electronBuilder;
        let requireSpy;
        let existsSyncSpy;


        // this.locations = {
        //     platformRootDir: platformRootDir,
        //     root: this.root,
        //     www: path.join(this.root, 'www'),
        //     res: path.join(this.root, 'res'),
        //     platformWww: path.join(this.root, 'platform_www'),
        //     configXml: path.join(this.root, 'config.xml'),
        //     defaultConfigXml: path.join(this.root, 'cordova/defaults.xml'),
        //     build: path.join(this.root, 'build'),
        //     buildRes: path.join(this.root, 'build-res'),
        //     cache: path.join(this.root, 'cache'),
        //     // NOTE: Due to platformApi spec we need to return relative paths here
        //     cordovaJs: 'bin/templates/project/assets/www/cordova.js',
        //     cordovaJsSrc: 'cordova-js-src'
        // };

        const emptyObj = {};
        const api = new Api(null, 'platform_www', '');

        beforeEach(() => {
            ElectronBuilder = build.__get__('ElectronBuilder');

            build.__set__({ require: requireSpy });
        });

        it('should should be defined.', () => {
            expect(ElectronBuilder).toBeDefined();
        });

        it('should set isDevelopment to undefined and buildConfig to false, when buildOptions is empty.', () => {
            electronBuilder = new ElectronBuilder(emptyObj, emptyObj);

            expect(electronBuilder.api).toEqual(emptyObj);
            expect(electronBuilder.isDevelopment).toEqual(undefined);
            expect(electronBuilder.buildConfig).toEqual(false);
        });

        it('should set isDevelopment to true and buildConfig to false, when buildOptions is not empty.', () => {
            // mock buildOptions Objecet
            const buildOptions = { debug: true, argv: [] };

            electronBuilder = new ElectronBuilder(buildOptions, emptyObj);

            expect(electronBuilder.api).toEqual(emptyObj);
            expect(electronBuilder.isDevelopment).toEqual(true);
            expect(electronBuilder.buildConfig).toEqual(false);
        });

        it('should set isDevelopment to true and buildConfig to false, when buildOptions.buildCofing is defined, but does not exist.', () => {
            // mock buildOptions Objecet
            const buildOptions = { debug: true, buildConfig: 'build.xml', argv: [] };

            // create spy
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(false);
            build.__set__('fs', { existsSync: existsSyncSpy });

            electronBuilder = new ElectronBuilder(buildOptions, emptyObj);

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(electronBuilder.api).toEqual(emptyObj);
            expect(electronBuilder.isDevelopment).toEqual(true);
            expect(electronBuilder.buildConfig).toEqual(false);
        });

        it('should set isDevelopment to true and buildConfig to true, when buildOptions.buildCofing is defined and does exist.', () => {
            // mock buildOptions Objecet
            const buildOptions = { debug: true, buildConfig: {}, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(true);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            electronBuilder = new ElectronBuilder(buildOptions, emptyObj);

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();
            expect(electronBuilder.api).toEqual(emptyObj);
            expect(electronBuilder.isDevelopment).toEqual(true);
            expect(electronBuilder.buildConfig).toEqual(true);
        });

        it('should set isDevelopment is true and buildConfig to actual config, when buildOptions.buildCofing is actual cofing and does exist.', () => {
            // mock BuildConfig and buildOptions Object
            const buildConfig = {
                electron: 'electron',
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: true, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).configure();

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();
            expect(electronBuilder.buildSettings).toEqual(buildConfig);
        });

        it('should set isDevelopment to false and buildConfig to actual config, when buildOptions.buildCofing is actual cofing and does exist.', () => {
            // mock BuildConfig and buildOptions Object
            const buildConfig = {
                electron: 'electron',
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: false, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).configure();

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();
            expect(electronBuilder.buildSettings).toEqual(buildConfig);
        });

        it('should set configureUserBuildSettings (release mode) for all 3 platforms and one invalid one.', () => {
            // mock platformConfig, buildConfig and buildOptions Objects
            const platformConfig = {
                'mac': { package: ['package', 'package2'], arch: 'arch', signing: { debug: 'debug', release: 'release', store: 'store' } },
                'win': { package: ['package', 'package2'], arch: 'arch', signing: { debug: 'debug', release: 'release' } },
                'linux': { package: ['package', 'package2'], arch: 'arch', signing: { debug: 'debug', release: 'release' } },
                'darwin': {}
            };
            const buildConfig = {
                electron: platformConfig,
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: false, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            const __validateUserPlatformBuildSettingsSpy = jasmine.createSpy('__validateUserPlatformBuildSettings').and.returnValue(true);
            build.__set__({ __validateUserPlatformBuildSettings: __validateUserPlatformBuildSettingsSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).configureUserBuildSettings();

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();

            const expectedMac = {
                target: [
                    { target: 'package', arch: 'arch' },
                    { target: 'package2', arch: 'arch' }
                ],
               type: '${BUILD_TYPE}'
            };
            const expectedLinux = {
                target: [
                    { target: 'package', arch: 'arch' },
                    { target: 'package2', arch: 'arch' }
                ]
            };

            expect(electronBuilder.userBuildSettings.config.mac).toEqual(expectedMac);
            expect(electronBuilder.userBuildSettings.config.linux).toEqual(expectedLinux);
            expect(electronBuilder.userBuildSettings.config.win).toEqual(undefined);
        });

        it('should set configureUserBuildSettings (debug mode) for all 3 platforms and one invalid one.', () => {
            // mock platformConfig, buildConfig and buildOptions Objects
            const platformConfig = {
                'mac': { package: ['package', 'package2'], arch: 'arch', signing: { debug: 'debug', release: 'release', store: 'store' } },
                'win': { package: ['package', 'package2'], arch: 'arch', signing: { debug: 'debug', release: 'release' } },
                'linux': { package: ['package', 'package2'], arch: 'arch', signing: { debug: 'debug', release: 'release' } },
                'darwin': {}
            };
            const buildConfig = {
                electron: platformConfig,
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: true, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            const __validateUserPlatformBuildSettingsSpy = jasmine.createSpy('__validateUserPlatformBuildSettings').and.returnValue(true);
            build.__set__({ __validateUserPlatformBuildSettings: __validateUserPlatformBuildSettingsSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).configureUserBuildSettings();

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();

            const expectedMac = {
                target: [
                    { target: 'package', arch: 'arch' },
                    { target: 'package2', arch: 'arch' }
                ],
               type: '${BUILD_TYPE}'
            };
            const expectedLinux = {
                target: [
                    { target: 'package', arch: 'arch' },
                    { target: 'package2', arch: 'arch' }
                ]
            };

            expect(electronBuilder.userBuildSettings.config.mac).toEqual(expectedMac);
            expect(electronBuilder.userBuildSettings.config.linux).toEqual(expectedLinux);
            expect(electronBuilder.userBuildSettings.config.win).toEqual(undefined);
        });

        it('should set configureUserBuildSettings for all 3 platforms without package.', () => {
            // mock platformConfig, buildConfig and buildOptions Objects
            const platformConfig = {
                'mac': { arch: 'arch', signing: { debug: 'debug', release: 'release', store: 'store' } },
                'win': { arch: 'arch', signing: { debug: 'debug', release: 'release' } },
                'linux': { arch: 'arch', signing: { debug: 'debug', release: 'release' } }
            };
            const buildConfig = {
                electron: platformConfig,
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: false, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            const __validateUserPlatformBuildSettingsSpy = jasmine.createSpy('__validateUserPlatformBuildSettings').and.returnValue(true);
            build.__set__({ __validateUserPlatformBuildSettings: __validateUserPlatformBuildSettingsSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).configureUserBuildSettings();

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();

            expect(electronBuilder.userBuildSettings).toEqual(buildOptions);
        });

        it('should set configureUserBuildSettings for all 3 platforms without arch.', () => {
            // mock platformConfig, buildConfig and buildOptions Objects
            const platformConfig = {
                'mac': { package: ['package', 'package2'], signing: { debug: 'debug', release: 'release', store: 'store' } },
                'win': { package: ['package', 'package2'], signing: { debug: 'debug', release: 'release' } },
                'linux': { package: ['package', 'package2'], signing: { debug: 'debug', release: 'release' } }
            };
            const buildConfig = {
                electron: platformConfig,
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: false, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            const __validateUserPlatformBuildSettingsSpy = jasmine.createSpy('__validateUserPlatformBuildSettings').and.returnValue(true);
            build.__set__({ __validateUserPlatformBuildSettings: __validateUserPlatformBuildSettingsSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).configureUserBuildSettings();

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();

            const expectedMac = {
                target: [
                    { target: 'package', arch: [ 'x64' ] },
                    { target: 'package2', arch: [ 'x64' ] }
                ],
               type: '${BUILD_TYPE}'
            };
            const expectedLinux = {
                target: [
                    { target: 'package', arch: [ 'x64' ] },
                    { target: 'package2', arch: [ 'x64' ] }
                ]
            };

            expect(electronBuilder.userBuildSettings.config.mac).toEqual(expectedMac);
            expect(electronBuilder.userBuildSettings.config.linux).toEqual(expectedLinux);
            expect(electronBuilder.userBuildSettings.config.win).toEqual(undefined);
        });

        it('should set configureUserBuildSettings for all 3 platforms without signing.', () => {
            // mock platformConfig, buildConfig and buildOptions Objects
            const platformConfig = {
                'mac': { package: ['package', 'package2'], arch: 'arch' },
                'win': { package: ['package', 'package2'], arch: 'arch' },
                'linux': { package: ['package', 'package2'], arch: 'arch' }
            };
            const buildConfig = {
                electron: platformConfig,
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: true, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            const __validateUserPlatformBuildSettingsSpy = jasmine.createSpy('__validateUserPlatformBuildSettings').and.returnValue(true);
            build.__set__({ __validateUserPlatformBuildSettings: __validateUserPlatformBuildSettingsSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).configureUserBuildSettings();

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();

            const expectedMac = {
                target: [
                    { target: 'package', arch: 'arch' },
                    { target: 'package2', arch: 'arch' }
                ],
               type: '${BUILD_TYPE}'
            };
            const expectedLinux = {
                target: [
                    { target: 'package', arch: 'arch' },
                    { target: 'package2', arch: 'arch' }
                ]
            };

            expect(electronBuilder.userBuildSettings.config.mac).toEqual(expectedMac);
            expect(electronBuilder.userBuildSettings.config.linux).toEqual(expectedLinux);
            expect(electronBuilder.userBuildSettings.config.win).toEqual(undefined);
        });

        it('should set configureUserBuildSettings for mac when platform configs is empty.', () => {
            // mock platformConfig, buildConfig and buildOptions Objects
            const platformConfig = {
                'mac': {}
            };
            const buildConfig = {
                electron: platformConfig,
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: false, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            const __validateUserPlatformBuildSettingsSpy = jasmine.createSpy('__validateUserPlatformBuildSettings').and.returnValue(true);
            build.__set__({ __validateUserPlatformBuildSettings: __validateUserPlatformBuildSettingsSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).configureUserBuildSettings();

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();
        });

        it('should throw new Error mac with incorrect platform build properties.', () => {
            // mock platformConfig, buildConfig and buildOptions Objects
            const platformConfig = {
                'mac': { pack: ['package', 'package2'], architecture: 'arch', sign: 'signing' }
            };
            const buildConfig = {
                electron: platformConfig,
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: false, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api);

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();
            expect(function () { electronBuilder.configureUserBuildSettings(); }).toThrow(
                new Error('The platform "mac" contains an invalid property. Valid properties are: package, arch, signing')
            );
        });

        it('should set configureUserBuildSettings for when using windows instead of win.', () => {
            // mock platformConfig, buildConfig and buildOptions Objects
            const platformConfig = {
                'windows': { package: ['mas', 'package2'], arch: 'arch', signing: 'signing' }
            };
            const buildConfig = {
                electron: platformConfig,
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            const buildOptions = { debug: false, buildConfig: buildConfig, argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(buildConfig);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            const __validateUserPlatformBuildSettingsSpy = jasmine.createSpy('__validateUserPlatformBuildSettings').and.returnValue(true);
            build.__set__({ __validateUserPlatformBuildSettings: __validateUserPlatformBuildSettingsSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).configureUserBuildSettings();

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();

            const expectedWin = {
                target: [
                    { target: 'mas', arch: 'arch' },
                    { target: 'package2', arch: 'arch' }
                ]
            };

            expect(electronBuilder.userBuildSettings.config.mac).toEqual(undefined);
            expect(electronBuilder.userBuildSettings.config.linux).toEqual(undefined);
            expect(electronBuilder.userBuildSettings.config.win).toEqual(expectedWin);
        });

        it('should fetchPlatformDefaults true.', () => {
            // mock buildOptions Objecet and platformFile path
            const buildOptions = { debug: true, buildConfig: 'build.xml', argv: [] };
            const platformFile = path.join(__dirname, 'build', 'platform.json');

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(true);
            requireSpy = jasmine.createSpy('require').and.returnValue(platformFile);
            build.__set__('fs', { existsSync: existsSyncSpy });
            build.__set__({ require: requireSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).fetchPlatformDefaults('electron');

            expect(existsSyncSpy).toHaveBeenCalled();
            expect(requireSpy).toHaveBeenCalled();
            expect(electronBuilder).toEqual(platformFile);
        });

        it('should fetchPlatformDefaults false.', () => {
            // mock buildOptions and BuildConfig Object
            const buildOptions = { debug: true, buildConfig: 'build.xml', argv: [] };

            // create spies
            existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(false);
            build.__set__('fs', { existsSync: existsSyncSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api);

            expect(existsSyncSpy).toHaveBeenCalled();

            expect(function () { electronBuilder.fetchPlatformDefaults('name'); }).toThrow(new Error('Your platform "name" is not supported as a default target platform for Electron.'));
        });

        it('should build called.', () => {
            // mock buildOptions Objecet
            const buildOptions = { debug: true, buildConfig: 'build.xml', argv: [] };
            const buildConfig = {
                electron: 'electron',
                author: 'Apache',
                name: 'Guy',
                displayName: 'HelloWorld',
                APP_BUILD_DIR: api.locations.build,
                APP_BUILD_RES_DIR: api.locations.buildRes,
                APP_WWW_DIR: api.locations.www
            };

            // create spies
            requireSpy = jasmine.createSpy('require');
            build.__set__({ require: requireSpy });

            electronBuilder = new ElectronBuilder(buildOptions, api).build(this.buildConfig = buildConfig);

            expect(requireSpy).toHaveBeenCalled();
            // expect(buildSpy).toHaveBeenCalled();
        });
    });
});


            // Promise.resolve().then(function () {
            //     const api = new Api(null, '', '');
            //     this.locations = api.locations;
            //     this.events = { emit: emitSpy };
            //     this.config = api.config;
            //     this.parser = api.parser;
            //     this.parser.update_www = () => { return this; };
            //     this.parser.update_project = () => { return this; };

            //      const defaultConfigPathMock = path.join(api.locations.platformRootDir, 'cordova', 'defaults.xml');
            //     const ownConfigPathMock = api.locations.configXml;

            //      const copySyncSpy = jasmine.createSpy('copySync');
            //     prepare.__set__('fs', {
            //         existsSync: function (configPath) {
            //             return configPath === ownConfigPathMock;
            //         },
            //         copySync: copySyncSpy
            //     });

            //      // override classes and methods called in modules.export.prepare
            //     prepare.__set__('ConfigParser', FakeConfigParser);
            //     prepare.__set__('xmlHelpers', xmlHelpersMock);
            //     prepare.__set__('updateIcons', updateIconsFake);
            //     prepare.__set__('ManifestJsonParser', FakeParser);
            //     prepare.__set__('PackageJsonParser', FakeParser);
            //     prepare.__set__('SettingJsonParser', FakeParser);

            //      prepare.prepare(cordovaProject, {}, api);

            //      expect(copySyncSpy).toHaveBeenCalledWith(ownConfigPathMock, defaultConfigPathMock);
            //     expect(mergeXmlSpy).toHaveBeenCalled();
            //     expect(updateIconsSpy).toHaveBeenCalled();
            //     expect(constructorSpy).toHaveBeenCalled();
            //     expect(configureSpy).toHaveBeenCalled();
            //     expect(writeSpy).toHaveBeenCalled();

            //      const actual = emitSpy.calls.argsFor(0)[1];
            //     const expected = 'Generating defaults.xml';
            //     expect(actual).toContain(expected);
            // });

