# Development Environment

Developing with the Intershop PWA requires to download and install [Node.js](https://nodejs.org) with the included npm package manager. Check the project's `package.json` in the `engines` section for the recommended node version.

Clone or download the Intershop PWA GitHub project to your computer, e.g.

```bash
git clone https://github.com/intershop/intershop-pwa.git
```

After having cloned the project from the Git repository, open a command line in the project folder and run `npm install` to download all required dependencies into your development environment.

The project uses [Angular CLI](https://cli.angular.io) - a command line interface for Angular - that has to be installed globally. Run `npm install -g @angular/cli` once to globally install Angular CLI on your development machine.

Use `ng serve --open` to start up the development server and open the progressive web app in your browser.

> **Note:** With the default `environment.ts` configuration the application works with mock data and as a result of that with limited functionality. To experience and work with the full feature set of the Intershop PWA access to an Intershop Commerce Management server is required.

## Development Server

Run `ng serve` or `ng s` for a development server that is configured by default via `environment.ts` to use mocked responses instead of actual REST calls.

Running `ng serve --configuration production` or `ng s -c production` starts a development server that will communicate by default with the Intershop Commerce Management server of our public demo via REST API (see the used `environment.prod.ts` for the configuration).

The project is also configured to support the usage of an own local environment file `environment.local.ts` that can be configured according to your local development environment needs, e.g. with a different icmBaseURL or different configuration options (see the `environment.model.ts` for the available configuration options). This file will be ignored by Git so the developer specific settings will not be commited and accidentally shared.

To create such development specific `environment.local.ts` file just copy one of the two existing environment files and make the necessary configuration adaptions, e.g.

- set your `icmBaseURL: 'http://<YOUR_ICM_SERVER>',`
- set `production: false,`
- remove `mockServerAPI: true,`
- configure the wanted `features: ['compare', 'recently', ...],`
- maybe disable the service worker for development `serviceWorker: false,`

To use this local environment configuration, the server should be started with

```bash
ng s -c local
```

Once the server is running, navigate to http://localhost:4200 in your browser to see the application. The app will automatically reload if you change any of the source files.

Running `ng serve --port 4300` will start the server on a different port than the default 4200 port, e.g. if one wants to run multiple instances in paralell for comparison.

Running `ng serve --open` will automatically open a new browser tab with the started application. The different start options can be combined.

Further options of the development server can be found running `ng serve --help`.

> **Warning:** DO NOT USE webpack-dev-server IN PRODUCTION environments!

## Development Tools

The used IDE or editor should support the [Prettier - Code formatter](https://prettier.io) that is configured to apply a common formatting style on all TypeScript, Javascript, JSON, HTML, SCSS and other files. In addition, especially for the file types that are not handled by Prettier, the editor needs to follow the [EditorConfig](http://editorconfig.org) configuration of the project to help maintain consistent coding styles. Besides that the project has [TSLint](https://palantir.github.io/tslint) and [Stylelint](https://stylelint.io) rules configured to unify the coding style even further.

The recommende IDE for the Intershop PWA development is

[**Visual Studio Code** ](https://code.visualstudio.com) = VS Code = VSC

It is a free IDE built on Open Source and available for the different plattforms with good TypeScript support maintained by Microsoft.

Within the PWA project we supply configuration files for VS Code that suggest downloading recommended plugins and apply best-practice settings (see the `.vscode` folder of the project).

If your editor or IDE provides no support for the formatting and linting, make sure the rules are applied otherwise. E.g. the project provides npm tasks that perform code style checks as well. Use `npm run lint` to run a static code analysis. Use `npm run format` to perform a formatting run on the code base with Prettier. `npm run stylelint` will apply a common code style to the projects styling definitions.

### Pre-Commit Check

`npm run check` is a combination task of `lint`, `format`, `stylelint` and `test` that runs some of the checks that will also be performed by the continuous integration system checks on the whole code base. Do not overuse it as the run might take some time on your local development environments.

Prefer using `npx lint-staged` to perform a manual quick evaluation of staged files. This also happens automatically when committing files with the configured pre-commit hooks for Git. It is possible to bypass the verification on commit with the Git option `--no-verify`.

## Debugging

Tips and tools for debugging Angular applications can be found on the Internet. As Angular runs in the Browser all the development tool functionality provided there can also be used for Angular (Debugging, Call Stacks, Profiling, Storage, Audits, ...).

### Browser Extensions

- [Redux DevTools](https://github.com/reduxjs/redux-devtools) for debugging application state changes

- [Angular Augury](https://augury.angular.io) for debugging and profiling Angular applications

### Recommend Articles

[Debugging Angular CLI Applications in Visual Studio Code](https://scotch.io/tutorials/debugging-angular-cli-applications-in-visual-studio-code)

- How to configure Visual Studio Code for debugging an Agular application.

[A Guide To Debugging Angular Applications](https://medium.com/front-end-weekly/a-guide-to-debugging-angular-applications-5a36bd88b4cf)

- Use `tap` to log output in RxJS streams. We introduced an operator called `log` for easier use.
- When inspecting an element in the browser development tools, you can then use `ng.probe($0).componentInstance` to get access to the Angular component.
- Use `ng.profiler.timeChangeDetection({record:true})` to profile a change detection cycle of the current page.
- Use the `json` pipe in Angular to print out data on templates. Easy-to-use snippets are available with `ng-debug` and `ng-debug-async` .

[Everything you need to know about debugging Angular applications](https://indepth.dev/everything-you-need-to-know-about-debugging-angular-applications)

- Provides a more in-depth view about internals.

[Debug Angular apps in production without revealing source maps](https://medium.com/angular-in-depth/debug-angular-apps-in-production-without-revealing-source-maps-ab4a235edd85)

- If you also generate the source maps for production builds, you can load them in the browser development tools and use them for debugging production setups.
