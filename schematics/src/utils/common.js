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
    name = parsedPath.name.replace(new RegExp(`\-?${artifact}$`), '');
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
    const kebab = core_1.strings.dasherize(name);
    const moduleImportPath = `/${path}${options.flat ? '' : `/${kebab}`}/${kebab}.${artifact}`;
    const artifactName = core_1.strings.classify(`${name}-${artifact}`);
    return Object.assign({}, options, { name,
        path,
        moduleImportPath,
        artifactName });
}
exports.applyNameAndPath = applyNameAndPath;
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
            path = `${project.sourceRoot}/app/core/${artifact}s/`;
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
function generateSelector(artifact, host, options) {
    const project = project_1.getProject(host, options.project);
    const selector = options.selector || selector_1.buildSelector(artifact, options, project.prefix);
    validation_1.validateHtmlSelector(selector);
    return Object.assign({}, options, { selector });
}
exports.generateSelector = generateSelector;
