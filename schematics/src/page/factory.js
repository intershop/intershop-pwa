"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const project_1 = require("@schematics/angular/utility/project");
const tsutils_1 = require("tsutils");
const ts = require("typescript");
const common_1 = require("../utils/common");
const filesystem_1 = require("../utils/filesystem");
function addRouteToArray(options, host, position, insertComma) {
    const dasherizedName = core_1.strings.dasherize(options.name);
    const loadChildren = `() => import('${options.child ? '..' : '.'}/${dasherizedName}/${dasherizedName}-page.module').then(m => m.${core_1.strings.classify(dasherizedName)}PageModule)`;
    const path = options.child ? options.child : dasherizedName;
    const canActivate = options.routingModule === '/src/app/pages/app-routing.module.ts' ? 'canActivate: [MetaGuard],' : '';
    const recorder = host.beginUpdate(options.routingModule);
    recorder.insertRight(position, `${insertComma ? ', ' : ''}{ path: '${path}', loadChildren: ${loadChildren}, ${canActivate} }`);
    host.commitUpdate(recorder);
}
function determineRoutingModule(host, options) {
    const project = project_1.getProject(host, options.project);
    let routingModuleLocation;
    let child;
    const match = options.name.match(/(.*)\-([a-z0-9]+)/);
    if (match && match[1] && match[2]) {
        const parent = match[1];
        child = match[2];
        // tslint:disable-next-line:no-console
        console.log(`detected subpage, will insert '${child}' as sub page of '${parent}'`);
        routingModuleLocation = options.extension
            ? `extensions/${options.extension}/pages/${parent}/${parent}-page.module.ts`
            : `pages/${parent}/${parent}-page.module.ts`;
    }
    else {
        routingModuleLocation = options.extension
            ? `extensions/${options.extension}/pages/${options.extension}-routing.module.ts`
            : 'pages/app-routing.module.ts';
    }
    const routingModule = core_1.normalize(`${project_1.buildDefaultPath(project)}/${routingModuleLocation}`);
    return Object.assign({}, options, { routingModule,
        child });
}
function addRouteToRoutingModule(options) {
    return host => {
        const newOptions = determineRoutingModule(host, options);
        const source = filesystem_1.readIntoSourceFile(host, newOptions.routingModule);
        tsutils_1.forEachToken(source, node => {
            if (node.kind === ts.SyntaxKind.Identifier && /^[a-zA-Z0-9]*(R|r)outes$/.test(node.getText())) {
                const parent = node.parent;
                if (parent.kind === ts.SyntaxKind.VariableDeclaration) {
                    const routesArray = tsutils_1.getChildOfKind(parent, ts.SyntaxKind.ArrayLiteralExpression);
                    if (routesArray) {
                        const routes = tsutils_1.getChildOfKind(routesArray, ts.SyntaxKind.SyntaxList);
                        if (routes.getChildCount() > 0) {
                            const lastChild = routes.getChildren()[routes.getChildCount() - 1];
                            const insertComma = lastChild.kind !== ts.SyntaxKind.CommaToken;
                            addRouteToArray(newOptions, host, lastChild.end, insertComma);
                        }
                        else {
                            addRouteToArray(newOptions, host, routes.end, false);
                        }
                    }
                }
            }
        });
    };
}
exports.addRouteToRoutingModule = addRouteToRoutingModule;
function createPage(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = common_1.detectExtension('page', host, options);
        options = common_1.applyNameAndPath('page', host, options);
        options = common_1.determineArtifactName('page', host, options);
        const operations = [];
        operations.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, core_1.strings, options)),
            schematics_1.move(options.path),
        ])));
        operations.push(schematics_1.schematic('component', Object.assign({}, options, { name: `${options.name}-page`, path: `${options.path}${options.name}`, flat: true })));
        operations.push(addRouteToRoutingModule(options));
        return schematics_1.chain(operations);
    };
}
exports.createPage = createPage;
