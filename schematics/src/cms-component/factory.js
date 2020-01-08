"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const common_1 = require("../utils/common");
const registration_1 = require("../utils/registration");
function createCMSComponent(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        else if (!options.definitionQualifiedName) {
            throw new schematics_1.SchematicsException('Option (definitionQualifiedName) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = common_1.detectExtension('cms', host, options);
        options = common_1.applyNameAndPath('component', host, options);
        if (!options.noCMSPrefixing) {
            options.name = 'cms-' + options.name;
        }
        options = common_1.determineArtifactName('component', host, options);
        if (!options.noCMSPrefixing) {
            options.artifactName = 'CMS' + options.artifactName.replace('Cms', '');
        }
        options = common_1.generateSelector(host, options);
        options.module = 'shared/shared.module';
        options = common_1.findDeclaringModule(host, options);
        const operations = [];
        operations.push(registration_1.addDeclarationToNgModule(options));
        operations.push(registration_1.addEntryComponentToNgModule(options));
        let cmModuleOptions = Object.assign({}, options, { module: 'shared/cms/cms.module' });
        cmModuleOptions = common_1.findDeclaringModule(host, cmModuleOptions);
        operations.push(registration_1.addImportToFile(cmModuleOptions));
        operations.push(registration_1.addProviderToNgModule({
            module: cmModuleOptions.module,
            artifactName: `{
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: '${options.definitionQualifiedName}',
        class: ${options.artifactName},
      },
      multi: true,
    }`,
        }));
        operations.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            options.styleFile ? schematics_1.noop() : schematics_1.filter(path => !path.endsWith('.__styleext__')),
            schematics_1.template(Object.assign({}, core_1.strings, options, { 'if-flat': s => (options.flat ? '' : s) })),
            schematics_1.move(options.path),
        ])));
        return schematics_1.chain(operations);
    };
}
exports.createCMSComponent = createCMSComponent;
