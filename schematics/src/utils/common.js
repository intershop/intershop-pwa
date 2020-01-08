"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const find_module_1 = require("@schematics/angular/utility/find-module");
const parse_name_1 = require("@schematics/angular/utility/parse-name");
const project_1 = require("@schematics/angular/utility/project");
const validation_1 = require("@schematics/angular/utility/validation");
const selector_1 = require("./selector");
function applyNameAndPath(artifact, host, options) {
    let path = options.path;
    let name = options.name;
    const project = project_1.getProject(host, options.project);
    // remove possible added path from root
    if (name && name.startsWith('src/app/')) {
        name = name.substr(8);
    }
    const parsedPath = parse_name_1.parseName(path || project_1.buildDefaultPath(project), name);
    name = parsedPath.name;
    if (artifact) {
        name = name.replace(new RegExp(`\-?${artifact}$`), '');
    }
    if (!options.restricted) {
        path = parsedPath.path;
    }
    if (options.artifactFolder) {
        // add artifact folder
        const containingFolder = `/${artifact}s`;
        if (!options.flat && !path.endsWith(containingFolder)) {
            path += containingFolder;
        }
    }
    validation_1.validateName(name);
    return Object.assign({}, options, { name,
        path });
}
exports.applyNameAndPath = applyNameAndPath;
function determineArtifactName(artifact, _, options) {
    const kebab = core_1.strings.dasherize(options.name);
    const moduleImportPath = `/${options.path}${options.flat ? '' : `/${kebab}`}/${kebab}.${artifact}`;
    const artifactName = core_1.strings.classify(`${options.name}-${artifact}`);
    return Object.assign({}, options, { moduleImportPath,
        artifactName });
}
exports.determineArtifactName = determineArtifactName;
function detectExtension(artifact, host, options) {
    const project = project_1.getProject(host, options.project);
    let extension = options.extension;
    const regex = /extensions\/([a-z][a-z0-9-]+)/;
    const requestDestination = core_1.normalize(`${options.path}/${options.name}`);
    if (regex.test(requestDestination)) {
        extension = requestDestination.match(regex)[1];
    }
    let path = options.path;
    if (options.restricted) {
        if (!extension) {
            let rootLocation;
            if (artifact === 'cms') {
                rootLocation = 'shared/';
            }
            else if (['page', 'extension'].includes(artifact)) {
                rootLocation = '';
            }
            else {
                rootLocation = 'core/';
            }
            path = `${project.sourceRoot}/app/${rootLocation}${artifact.replace(/s$/, '')}s/`;
        }
        else {
            path = `${project.sourceRoot}/app/extensions/${extension}/${artifact}s/`;
        }
    }
    return Object.assign({}, options, { extension,
        path });
}
exports.detectExtension = detectExtension;
function findDeclaringModule(host, options) {
    const module = find_module_1.findModuleFromOptions(host, Object.assign({}, options, { name: options.name }));
    return Object.assign({}, options, { module });
}
exports.findDeclaringModule = findDeclaringModule;
function generateSelector(host, options) {
    const project = project_1.getProject(host, options.project);
    const selector = options.selector || selector_1.buildSelector(options, project.prefix);
    validation_1.validateHtmlSelector(selector);
    return Object.assign({}, options, { selector });
}
exports.generateSelector = generateSelector;
