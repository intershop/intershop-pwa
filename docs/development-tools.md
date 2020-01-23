# Development Environment

## Development Tools

**Visual Studio Code** = VS Code = VSC - [https://code.visualstudio.com/](https://code.visualstudio.com/)

- IDE with good TypeScript support from Microsoft

**Angular CLI** - [https://cli.angular.io/](https://cli.angular.io/)

- A command line interface for Angular

**Browser Extensions**:

- Angular Augury - [https://augury.angular.io/](https://augury.angular.io/)  
  Google Chrome Developer Tool extension for debugging and profiling Angular applications

- Redux Dev Tools
  - [https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=de](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=de)
  - [https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)  
    Redux DevTools for debugging application's state changes

## Development Environment Configuration

The used IDE or editor should support the [Prettier - Code formatter](https://prettier.io/) that is configured to apply a common formatting style on all TypeScript, Javascript, JSON, HTML, SCSS and other files. In addition, especially for the file types that are not handled by Prettier, the editor needs to follow the [EditorConfig](http://editorconfig.org) configuration of the project to help maintain consistent coding styles. In addition to Prettier, [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) and [Stylelint](https://stylelint.io/) rules unify the coding style too.

With the PWA project we also supply configuration files for VSCode that suggest downloading recommended plugins and apply best-practice settings.

If your editor or IDE provides no support for the formatting and linting, make sure the rules are applied otherwise. Pre-commit hooks for git are also configured to take care of this.

Also check the project's [_README.md_](https://github.com/intershop/intershop-pwa/blob/develop/README.md) for available npm tasks that handle code style checks as well.

### environment.local.ts

It might be helpful to use your own local environment file _environment.local.ts_ for development purposes. Ignoring it from Git opens up possibilities for local editing without accidentally sharing it. As a result you can save the system properties of your installation, e.g.,

![Right](icons/tip.png) **environment.local.properties**

 ```typescript
export const environment = {
  production: false,

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */

  icmBaseURL: '[https://localhost:8444](https://localhost:8444)',
  icmServer: 'INTERSHOP/rest/WFS',
  ...

 };
```

Use this environment by starting your server this way:

````bash
ng serve --configuration local
````

## Debugging

Tips and tools for debugging Angular applications can be found on the net. As Angular runs in the Browser all the development tool functionality provided there can also be used for Angular (Debugging, Call Stacks, Profiling, Storage, Audits, ...).

Furthermore we recommend reading the following articles for specifics about Angular:

[A Guide To Debugging Angular Applications](https://medium.com/front-end-weekly/a-guide-to-debugging-angular-applications-5a36bd88b4cf)

- Use `tap` to log output in RxJS streams. We introduced an operator called `log` for easier use.
- When inspecting an element in the browser development tools, you can then use `ng.probe($0).componentInstance` to get access to the Angular component.
- Use `ng.profiler.timeChangeDetection({record:true})` to profile a change detection cycle of the current page.
- Use the `json` pipe in Angular to print out data on templates. Easy-to-use snippets are available with `ng-debug` and `ng-debug-async` .

[Everything you need to know about debugging Angular applications](https://blog.angularindepth.com/everything-you-need-to-know-about-debugging-angular-applications-d308ed8a51b4)

- Provides a more in-depth view about internals.

[Debug Angular apps in production without revealing source maps](https://blog.angularindepth.com/debug-angular-apps-in-production-without-revealing-source-maps-ab4a235edd85)

- If you also generate the source maps for production builds, you can load them in the browser development tools and use them for debugging production setups.

[Debugging Angular CLI Applications in Visual Studio Code](https://scotch.io/tutorials/debugging-angular-cli-applications-in-visual-studio-code)

- You can setup VSCode for debugging.
