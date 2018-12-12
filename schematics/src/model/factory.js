"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const common_1 = require("../utils/common");
function createModel(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = common_1.detectExtension('model', host, options);
        options = common_1.applyNameAndPath('model', host, options);
        options = common_1.determineArtifactName('model', host, options);
        return schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            !options.simple ? schematics_1.noop() : schematics_1.filter(path => path.endsWith('model.__tsext__')),
            schematics_1.template(Object.assign({}, core_1.strings, options)),
            schematics_1.move(options.path),
        ]));
    };
}
exports.createModel = createModel;
