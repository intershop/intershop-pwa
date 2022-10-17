<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Getting Started

## Quick Start

Before working with this project, download and install [Node.js](https://nodejs.org) with the included npm package manager.
Currently Node.js 16.x LTS with the corresponding npm is required.

After having cloned the project from the Git repository, open a command line in the project folder and run `npm install`.

The project uses Angular CLI which has to be installed globally.
Run `npm install -g @angular/cli` once to globally install Angular CLI on your development machine.

Use `ng serve --open` to start up the development server and open the Progressive Web App in your browser.

For more information about environment configuration, server and tools consult the according chapters in the [Development Guide](./development.md).

## Customization

Before customizing the PWA for your specific needs, have a look at our [Customization Guide](./customizations.md) and also have a look at the current [PWA Guide](https://support.intershop.de/kb/index.php?c=Search&qoff=0&qtext=guide+progressive+web+app) first.

## Deployment

Deployments are generated to the _dist_ folder of the project.

Use `npm run build` to generate an Angular Universal enabled version.
On the server the _dist/server.js_ script has to be executed with `node`.

Alternatively, you can use `npm run build client` to get an application using browser rendering.
All the files under `dist/browser` have to be served statically.
The server has to be configured for fallback routing,
see [Server Configuration in Angular Docs](https://angular.io/guide/deployment#server-configuration).

For a production setup we recommend building the docker image supplied with the `Dockerfile` in the root folder of the project.
Build it with `docker build -t my_pwa .`.
To run the PWA with multiple channels and [Google PageSpeed](https://developers.google.com/speed/pagespeed/insights/) optimizations, you can use the nginx docker image supplied in the sub folder [nginx](../../nginx).

We provide templates for [Kubernetes Deployments](../../schematics/src/kubernetes-deployment) and [DevOps](../../schematics/src/azure-pipeline) for Microsoft Azure.

## Running Tests

Run `npm test` to start an on the fly test running environment to execute the unit tests via [Jest](https://jestjs.io/) once.
To run Jest in watch mode with interactive interface, run `npm run test:watch`.

Run `npm run e2e` to execute the end-to-end tests via [cypress](https://www.cypress.io/).
You have to start your development or production server first as cypress will instruct you.

Head over to the [Testing Concept](../concepts/testing.md) documentation for more information.

## Code Style

Use `npm run lint` to run a static code analysis.

For development make sure the used IDE or editor follows the [EditorConfig](https://editorconfig.org/) configuration of the project and uses [Prettier](https://prettier.io/) to help maintain consistent coding styles (see `.editorconfig` and `.prettierrc.json`).

Use `npm run format` to perform a formatting run on the code base with Prettier.

## Type Safety

The Intershop PWA has both TypeScript's [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) and Angular's [`strictTemplates`](https://angular.io/guide/template-typecheck) compile options active to ensure everything is typed correctly.

Learning the TypeScript typing system can be quite hard and it can take years to finally master it, but it also helps to avoid bugs by passing around untyped data.
Typing can be especially tedious when it comes to tests, but there it is as important as in the production code.
If the tests are running successfully on untyped (and sometimes outdated) data, nobody will be the wiser.

Almost everything can be typed correctly without using `any`.
If generic typing is not possible, you can use `unknown` or `object` for utility functions.
In most other cases, the typings can be correctly applied.

We encourage everybody to up their game about strict typing with TypeScript, but as always, there are ways around it.
We supply a [`tsconfig.app-no-checks.json`](../../tsconfig.app-no-checks.json) in the source root, that can be used for Angular builders in the `angular.json` to disable all safety features.
However, we don't support doing this for production builds.

## Pre-Commit Check

`npm run check` is a combination task of `lint`, `format` and `test` that runs some of the checks that will also be performed in continuous integration on the whole code base.
Do not overuse it as the run might take a long time.

Prefer using `npx lint-staged` to perform a manual quick evaluation of staged files.
This also happens automatically when committing files.
It is also possible to bypass verification on commit, following the suggestions of the versioning control tool of your choice.

## Code Scaffolding

With the integrated `intershop-schematics` this project provides the functionality to generate different code artifacts according to our style guide and project structure. `ng generate` will use our custom schematics by default, e.g. run `ng generate component component-name` in the shared folder to generate a new shared component. `ng generate --help` gives an overview of available Intershop-specific schematics.

The Angular CLI default schematics are still available and working.
However, they need to be prefixed to use them, e.g. `ng generate @schematics/angular:guard`.
A list of the available Angular CLI schematics can be fetched with `ng generate @schematics/angular: --help`.

## Further Help

To get more help on the Angular CLI, use `ng help` or check out the [Angular CLI Documentation](https://github.com/angular/angular-cli/wiki).
