<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Getting Started

## Quick Start

Before working with this project, download and install [Node.js](https://nodejs.org) with the included npm package manager.
Currently Node.js 18.16.0 LTS with the corresponding npm 9.5.1 is used for development.

The project uses [Angular CLI](https://angular.io/cli) which has to be installed globally.
Run `npm install -g @angular/cli` once to globally install Angular CLI on your development machine.

### Step 1 - Clone the Project

```bash
git clone https://github.com/intershop/intershop-pwa.git
```

### Step 2 - Install the Dependencies

After having cloned the project from the Git repository, change into the project folder and run:

```bash
npm install
```

### Step 3 - Start the Intershop PWA

To start the development server (meaning that changes to the projects source code will automatically be build and reloaded) and open the Intershop PWA in your browser run:

```bash
ng serve --open
```

> [!NOTE]
> The project is configured to work by default against a publicly available Intershop Commerce Management server (see `environment.model.ts`).
>
> ```
> icmBaseURL: 'https://pwa-ish-demo.test.intershop.com',
> ```
>
> To run your PWA against an own ICM server configure the `icmBaseURL` in your local `environment.development.ts` or set the `icmBaseURL` in your projects `environment.model.ts` to your own ICM default server.
>
> In the same way the default `icmChannel` configuration needs to be adapted if your own ICM with your own organization should be used.

For more information about the development environment configuration, server and tools consult the according chapters in the [Development Guide](./development.md).

To simply build and start the Intershop PWA with Server Side Rendering for testing but without the automatic building and reloading of code changes `npm start` works as well and does not require Angular CLI to be installed.

## Customization

When starting your own project based on the Intershop PWA that includes customizing the PWA for your specific needs, have a look at our [Customization Guide](./customizations.md) first.

## Deployment

For production and production like deployments we provide an [Intershop PWA Helm Chart](https://github.com/intershop/helm-charts/tree/main/charts/pwa) for Kubernetes deployments.

> [!NOTE]
> For a Helm chart deployment the configuration property `upstream.icmBaseURL` is a required parameter that should point to your own ICM server.
>
> ```yaml
> upstream:
>   icmBaseURL: https://pwa-ish-demo.test.intershop.com
> ```

For a simple production like development or testing deployment of the current project state the project includes a `docker-compose.yml` that can be deployed with `docker compose up --build` in the project root.
This will deploy both containers of the Intershop PWA - the pwa (SSR) container as well as the nginx container.

> [!NOTE]
> For the docker compose deployment an own ICM server can be configured with:
>
> ```yaml
> services:
>   pwa:
>     environment:
>       ICM_BASE_URL: 'https://pwa-ish-demo.test.intershop.com'
> ```

You can also manually build the docker image supplied with the `Dockerfile` in the root folder of the project.
Build it with `docker build -t my_pwa .`.
To run the PWA with multiple channels you can use the nginx docker image supplied in the sub folder [nginx](../../nginx).

In general the deployment artifacts of the Intershop PWA are generated to the _dist_ folder of the project.
Use `npm run build` to generate an Angular Universal enabled version.
On the server the _dist/server.js_ script has to be executed with `node`.
Alternatively, you can use `npm run build client` to get an application using browser rendering.
All the files under `dist/browser` have to be served statically.
The server has to be configured for fallback routing,
see [Server Configuration in Angular Docs](https://angular.io/guide/deployment#server-configuration).

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
