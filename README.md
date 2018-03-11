# REST based storefront PoC

The proof of concept for a REST based storefront clone of the Responsive Starter Store.

It is supposed to implement the Family Page and the Registration Page as an Angular application based on the according pages from the Responsive Starter Store using only the REST API of the Intershop Commerce Management.

The Family Page will be a playground for testing of paging, SEO, server side rendering, page load optimizations etc.

The Registration Page will feature form handling, validation and interaction with data binding.

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) and follows the Angular CLI style guide and naming coventions.

---

## Project setup

```
git clone https://gitlab.intershop.de/rest-based-storefront/proof-of-concept.git
cd proof-of-concept
npm install
ng serve --open
```

The `ng ...` commands require Angular CLI to be installed globally. Run `npm install -g @angular/cli` once to globally install Angular CLI on your development mashine.

The project can alternatively be run with `npm start`.

## Development server

Run `ng serve` or `ng s` for a dev server that is configured via `environment.ts` to use mocked responses instead of actual REST calls.

Running `ng serve --environment prod` or `ng s -e prod` will start a server that will comunicate via REST API with the Intershop Commerce Management. The used `environment.prod.ts` is configured to be used with the [`intershop7-devenv`](https://gitlab.intershop.de/rest-based-storefront/intershop7-devenv) in a docker toolbox with IP `192.168.99.100`.

> If a different setup is used the IP address and port can be changed in the `environment.prod.ts` or the IP address could be mapped. For running the docker container native on Linux, one could do `sudo iptables -t nat -A OUTPUT -d 192.168.99.100 -j DNAT --to-destination 127.0.0.1` to enable this mapping.

Once the server is running, navigate to `http://localhost:4200/` in your browser to see the application. The app will automatically reload if you change any of the source files.

Running `ng serve --port 4300` will start the server on different port than the default 4200 port, e.g. if one wants to run multiple instances in paralell for comparison.

Running `ng serve --open` will automatically open a new browser tab with the started application. The different start options can be combined.

## Deployment

Deployments are generated to the `dist` folder of the project.

Use `npm run build` to get an application using browser rendering. All the files under `dist/browser` have to be served statically.

Use `npm run build:static` to generate a prerendered version. All the files under `dist/browser` have to be served statically. Paths entered in `static.paths.js` are pre-rendered for static serving. This speeds up browser-side bootstrapping.

Use `npm run build:dynamic` to generate the angular universal enabled version. On the server the `dist/server.js` script has to be executed with `node`.

see also [Server Configuration in Angular Docs](https://angular.io/guide/deployment#server-configuration)

## Progressive Web App (PWA)

To run the project as a Progressive Web App with an enabled [Service Worker](https://angular.io/guide/service-worker-getting-started) use `npm run start:static:prod` to build an serve the application. After that open `http://localhost:4000` in your browser and test it or run a PWA Audit. Currently only `localhost` or `127.0.0.1` will work with the service worker since it requires `https` communication on any other domain.

## Running unit tests

Run `ng test` to start an on the fly test running environment or `gradlew karma` to execute the unit tests via [Karma](https://karma-runner.github.io) once.

## Running end-to-end tests

Run `ng e2e` or `gradlew protractor` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
The application is automatically started in the background.

Run `gradlew test` to execute the end-to-end tests via [geb+spock](http://www.gebish.org/).
Gradle automatically starts the application in the background.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running the CI build locally

A complete build like in the build plan can be started with:
`gradlew build -Dgeb.env=ci`.

To run the CI build of gitlab locally within a nativ Linux environment you can use `gitlab-runner`. Get it [here](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/blob/master/docs/install/bleeding-edge.md). To execute the build, start `gitlab-ci-multi-runner exec docker build`.

## Utility tasks

Run `gradlew reset` to delete node binaries and the node_modules downloaded from npm install.

## Code formatting

Run `ng lint` to check the application of the default tslint rules configuration. `npm run lint` will additionaly check custom tslint rules.

For development make sure the used IDE or Editor follows the [EditorConfig](http://editorconfig.org/) configuration of the project and uses [Prettier](https://prettier.io/) to help maintain consistent coding styles (see `.editorconfig` and `.prettierrc.json`).

Use `npm run format` or `gradlew format` to run Prettier to apply a consistent code style to the source code.

## Pre-Commit Check

`npm run check` is a combination task of `lint`, `format`, `test` and `e2e` that performs some of the checks that will be performed in GitLab too.

This task might be helpful to prevent the most common causes for red builds in GitLab. After a succesfull run, one needs to check for local file modifications done by `lint` or `format` that need to be added to the intended commit.

## Code Documentation

The project is configured to use [Compodoc](https://compodoc.github.io/website) as documentation tool. The output folder for the documentation is set to `\docs\compodoc`.

To generate the code documentation run `npm run docs`. To generate and serve the documentation at http://localhost:8080 run `npm run docs:serve`. Watching the source files to force documentation rebuild and serve run `npm run docs:watch`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
