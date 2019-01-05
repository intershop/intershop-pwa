# Intershop Progressive Web App

An Angular based storefront clone of the Responsive Starter Store that communicates with the Intershop Commerce Management server via REST API only.

---
Before working with this project, download and install [Node.js](https://nodejs.org) with the included npm package manager. Currently Node.js 10.x LTS with corresponding npm is required.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) and follows the Angular CLI style guide and naming coventions.

---

## Quick Start

After cloning the project from the Git repository open a command line in the project folder and run `npm install`.

The project uses Angular CLI which has to be installed globally. Run `npm install -g @angular/cli` once to globally install Angular CLI on your development machine. Use `ng serve` to start up the development server.

The project can alternatively be run in production mode with `npm start`.

## Project Update

An update of the project to a new release version might include added or updated dependencies. So in case of an update run `npm install` before serving or building the application.

## Development Server

Run `ng serve` or `ng s` for a dev server that is configured via `environment.ts` to use mocked responses instead of actual REST calls.

Running `ng serve --configuration production` or `ng s -c production` will start a server that will comunicate via REST API with the Intershop Commerce Management. The used `environment.prod.ts` is configured to be used with the [`intershop7-devenv`](https://gitlab.intershop.de/ISPWA/intershop7-devenv) in a docker toolbox with IP `192.168.99.100`.

> If a different setup is used the IP address and port can be changed in the `environment.prod.ts` or the IP address could be mapped. For running the docker container native on Linux, one could do `sudo iptables -t nat -A OUTPUT -d 192.168.99.100 -j DNAT --to-destination 127.0.0.1` to enable this mapping.

The project is also configured to support the usage of an own local environment file `environment.local.ts` that can be configured according to the development environment, e.g. with a different icmBaseURL or `production: false` for better debugging support while using a real server API. This file will be ignored by Git so the developer specific setting will not be commited. To use this local environment configuration the server should be started with `ng s -c local`.

Once the server is running, navigate to `http://localhost:4200/` in your browser to see the application. The app will automatically reload if you change any of the source files.

Running `ng serve --port 4300` will start the server on different port than the default 4200 port, e.g. if one wants to run multiple instances in paralell for comparison.

Running `ng serve --open` will automatically open a new browser tab with the started application. The different start options can be combined.

> DO NOT USE webpack-dev-server IN PRODUCTION!

## Deployment

Deployments are generated to the `dist` folder of the project.

Use `npm run build` to generate the preferred angular universal enabled version. On the server the `dist/server.js` script has to be executed with `node`.

You can alternatively use `ng build --prod` to get an application using browser rendering. All the files under `dist/browser` have to be served statically. The server has to be configured for fallback routing, 
see [Server Configuration in Angular Docs](https://angular.io/guide/deployment#server-configuration).

## Progressive Web App (PWA)

To run the project as a Progressive Web App with an enabled [Service Worker](https://angular.io/guide/service-worker-getting-started) use `npm run start` to build and serve the application. After that open `http://localhost:4200` in your browser and test it or run a PWA Audit. Currently only `localhost` or `127.0.0.1` will work with the service worker since it requires `https` communication on any other domain.

## Running Unit Tests

Run `npm test` to start an on the fly test running environment to execute the unit tests via [Jest](https://facebook.github.io/jest/) once. To run Jest in watch mode with interactive interface run `npm run test:watch`.

## Running End-to-End Tests

Run `npm run e2e` to execute the end-to-end tests via [cypress](https://www.cypress.io/).
You have to start your development or production server first as cypress will instruct you.

## Running CI Build Jobs Locally

To run the CI build of gitlab locally you can use `gitlab-runner`. Get it [here](https://docs.gitlab.com/runner/install/). To execute the build, start `gitlab-runner exec docker <job>`.

## Code Style

Use `npm run lint` to run a static code analysis.

For development make sure the used IDE or Editor follows the [EditorConfig](http://editorconfig.org/) configuration of the project and uses [Prettier](https://prettier.io/) to help maintain consistent coding styles (see `.editorconfig` and `.prettierrc.json`).

Use `npm run format` to perform a formatting run on the code base with Prettier.

## Pre-Commit Check

`npm run check` is a combination task of `lint`, `format` and `test` that runs some of the checks that will also be performed in Continuous Integration on the whole code base. Do not overuse it as the run might take a long time.

Prefer using `npx lint-staged` to perform a manual quick evaluation of staged files. This also happens automatically when committing files. It is also possible to bypass verification on commit, following the suggestions of the versioning control tool of your choice.

## Code Documentation

The project is configured to use [Compodoc](https://compodoc.github.io/website) as documentation tool. The output folder for the documentation is set to `\docs\compodoc`.

To generate the code documentation run `npm run docs`. To generate and serve the documentation at http://localhost:8080 run `npm run docs:serve`. Watching the source files to force documentation rebuild and serve run `npm run docs:watch`.

## Code Scaffolding

With the integrated `intershop-schematics` this project provides the functionality to generate different code artifacts according to our style guide and project structure. `ng generate` will use our custom schematics by default, e.g. run `ng generate component component-name` in the shared folder to generate a new shared component. `ng generate --help` gives an overview of available intershop specific schematics.

The Angular CLI default schematics are still available and working but they need to be prefixed to use them, e.g. `ng generate @schematics/angular:guard`. A list of the available Angular CLI schematics can be fetched with `ng generate @schematics/angular: --help`.

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Documentation](https://github.com/angular/angular-cli/wiki).
