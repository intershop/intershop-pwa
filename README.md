# REST based storefront PoC

The proof of concept for a REST based storefront clone of the Responsive Starter Store.

It is supposed to implement the Family Page and the Registration Page as an Angular application based on the according pages from the Responsive Starter Store using only the REST API of the Intershop Commerce Management.

The Family Page will be a playground for testing of paging, SEO, server side rendering, page load optimizations etc.

The Registration Page will feature form handling, validation and interaction with data binding.

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` or `gradlew karma` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` or `gradlew protractor` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
The application is automatically started in the background.

User `gradlew test` to execute the end-to-end tests via [geb+spock](http://www.gebish.org/).
Gradle automatically starts the application in the background.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Running the CI build locally

To run the CI build of gitlab locally you can use `gitlab-runner`. Get it [here](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/blob/master/docs/install/bleeding-edge.md). To execute the build, start `gitlab-ci-multi-runner exec docker build`.

