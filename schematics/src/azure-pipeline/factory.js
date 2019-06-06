"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const project_1 = require("@schematics/angular/utility/project");
function createAzurePipeline(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        const projectRoot = project_1.getProject(host, options.project).root;
        return schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, core_1.strings, options)),
            schematics_1.move(projectRoot),
        ]));
    };
}
exports.createAzurePipeline = createAzurePipeline;
