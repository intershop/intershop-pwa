# Intershop Progressive Web App

Welcome to the Intershop PWA project!

The Intershop PWA is an Angular-based progressive web app storefront for the Intershop Commerce Suite.

Accompany us on a journey for great cutting-edge eCommerce and take the chance to make it your journey, too.

If you want to get a first impression, please visit our [public demo](https://intershoppwa.azurewebsites.net/home).

More information on the PWA can be found [here](https://www.intershop.com/en/progressive-web-app).

In order to contribute, please have a look at our [Contribution Guidelines](./CONTRIBUTING.md)

## Getting Started

---

Before working with this project, download and install [Node.js](https://nodejs.org) with the included npm package manager. Currently Node.js 12.x LTS with the corresponding npm is required.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) and follows the Angular CLI style guide and naming coventions.

---

After having cloned the project from the Git repository, open a command line in the project folder and run `npm install`.

The project uses Angular CLI which has to be installed globally. Run `npm install -g @angular/cli` once to globally install Angular CLI on your development machine. Use `ng serve --open` to start up the development server and open the progressive web app in your browser.

The project can alternatively be run in production mode with `npm start`.

## Customization

Before customizing the PWA for your specific needs, have a look at our [Customization Guide](./docs/customizations.md) and also have a look at the current [PWA Guide](https://support.intershop.de/kb/index.php?c=Search&qoff=0&qtext=guide+progressive+web+app) first.

## Development Server

Run `ng serve` or `ng s` for a development server that is configured by default via `environment.ts` to use mocked responses instead of actual REST calls.

Running `ng serve --configuration production` or `ng s -c production` starts a server that will communicate by default with the Intershop Commerce Management of our public demo via REST API (see the used `environment.prod.ts` for the configuration).

The project is also configured to support the usage of an own local environment file `environment.local.ts` that can be configured according to the development environment, e.g. with a different icmBaseURL or different configuration options (see the `environment.model.ts`). This file will be ignored by Git so the developer-specific setting will not be commited. To use this local environment configuration, the server should be started with `ng s -c local`.

Once the server is running, navigate to `http://localhost:4200/` in your browser to see the application. The app will automatically reload if you change any of the source files.

Running `ng serve --port 4300` will start the server on a different port than the default 4200 port, e.g., if one wants to run multiple instances in paralell for comparison.

Running `ng serve --open` will automatically open a new browser tab with the started application. The different start options can be combined.

> DO NOT USE webpack-dev-server IN PRODUCTION!

## Deployment

Deployments are generated to the `dist` folder of the project.

Use `npm run build` to generate the preferred angular universal enabled version. On the server the `dist/server.js` script has to be executed with `node`.

Alternatively, you can use `ng build --prod` to get an application using browser rendering. All the files under `dist/browser` have to be served statically. The server has to be configured for fallback routing,
see [Server Configuration in Angular Docs](https://angular.io/guide/deployment#server-configuration).

For a production setup we recommend building the docker image supplied with the `Dockerfile` in the root folder of the project. Build it with `docker build -t my_pwa .`. To run the PWA with multiple channels and [Google PageSpeed](https://developers.google.com/speed/pagespeed/insights/) optimizations, you can use the nginx docker image supplied in the sub folder [nginx](./nginx).

We provide templates for [Kubernetes Deployments](./schematics/src/kubernetes-deployment) and [DevOps](./schematics/src/azure-pipeline) for Microsoft Azure.

## Progressive Web App (PWA)

To run the project as a Progressive Web App with an enabled [Service Worker](https://angular.io/guide/service-worker-getting-started), use `npm run start` to build and serve the application. After that open `http://localhost:4200` in your browser and test it or run a PWA Audit. Currently only `localhost` or `127.0.0.1` will work with the service worker since it requires `https` communication on any other domain.

## Running Unit Tests

Run `npm test` to start an on the fly test running environment to execute the unit tests via [Jest](https://facebook.github.io/jest/) once. To run Jest in watch mode with interactive interface, run `npm run test:watch`.

## Running End-to-End Tests

Run `npm run e2e` to execute the end-to-end tests via [cypress](https://www.cypress.io/).
You have to start your development or production server first as cypress will instruct you.

## Code Style

Use `npm run lint` to run a static code analysis.

For development make sure the used IDE or Editor follows the [EditorConfig](http://editorconfig.org/) configuration of the project and uses [Prettier](https://prettier.io/) to help maintain consistent coding styles (see `.editorconfig` and `.prettierrc.json`).

Use `npm run format` to perform a formatting run on the code base with Prettier.

## Pre-Commit Check

`npm run check` is a combination task of `lint`, `format` and `test` that runs some of the checks that will also be performed in Continuous Integration on the whole code base. Do not overuse it as the run might take a long time.

Prefer using `npx lint-staged` to perform a manual quick evaluation of staged files. This also happens automatically when committing files. It is also possible to bypass verification on commit, following the suggestions of the versioning control tool of your choice.

## Code Scaffolding

With the integrated `intershop-schematics` this project provides the functionality to generate different code artifacts according to our style guide and project structure. `ng generate` will use our custom schematics by default, e.g. run `ng generate component component-name` in the shared folder to generate a new shared component. `ng generate --help` gives an overview of available Intershop-specific schematics.

The Angular CLI default schematics are still available and working. However, they need to be prefixed to use them, e.g. `ng generate @schematics/angular:guard`. A list of the available Angular CLI schematics can be fetched with `ng generate @schematics/angular: --help`.

## Further Help

To get more help on the Angular CLI, use `ng help` or check out the [Angular CLI Documentation](https://github.com/angular/angular-cli/wiki).

## License

The Intershop Progressive Web App is made available under the [MIT license](./LICENSE).
