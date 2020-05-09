"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("@angular-devkit/schematics/tasks");
/**
 * adapted from @schematics/angular/utility/lint-fix
 */
function applyLintFix() {
    return (tree, context) => {
        // Only include files that have been touched.
        const files = tree.actions.reduce((acc, action) => {
            const path = action.path.substr(1); // Remove the starting '/'.
            if (path.endsWith('.ts')) {
                acc.add(path);
            }
            return acc;
        }, new Set());
        // suppress warning for rules requiring type information, throw on other warnings
        console.warn = message => {
            if (!/Warning: The '.*' rule requires type information./.test(message)) {
                throw new Error(message);
            }
        };
        context.addTask(new tasks_1.TslintFixTask({
            ignoreErrors: true,
            silent: true,
            tsConfigPath: 'tsconfig.all.json',
            files: [...files],
        }));
    };
}
exports.applyLintFix = applyLintFix;
