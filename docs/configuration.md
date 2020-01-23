# Configuration

In a complex application like the Intershop Progressive Web App, there are multiple ways and kinds of configuration. The complexity increases if you consider that the communication with Intershop Commerce Management has to be coordinated as well. In addition, the PWA, when run with Angular Universal, consists of a server-side and a client-side application.

## Ways of Configuring Angular Applications

> ![Warning](icons/warning.png) If available, always prefer configuration via system environment variables and running the PWA with Universal Rendering.

### Angular CLI Environments

The standard way of configuring an Angular Application can be done by managing multiple environment files that are part of the project's source tree, usually located in _src/environments._ To choose one configuration, you have to supply the parameter during building the Angular Application. The file _angular.json_ defines how the correct environment file is swapped in for the corresponding environment. See [Angular 2: Application Settings using the CLI Environment Option](http://tattoocoder.com/angular-cli-using-the-environment-option/) for further information.

Properties supplied with environment files should not be accessed directly in artifacts other than modules. Instead, you need to provide them via `InjectionToken`s to be used in components, pipes or services. The `InjectionToken` can be used to access a certain property later on:

````typescript
export const PROPERTY = new InjectionToken<string>('property');


@NgModule({
  providers: [
    { provide: PROPERTY, useValue: environment.property }
  ],
})
export class SomeModule {}
````

**Property consumer**

````typescript
import { Inject } from '@angular/core'
import { PROPERTY } from '../injection-keys'

...

constructor(@Inject(PROPERTY) private property: string)
````

It is good practice to never write those properties at runtime.

As can be seen here, only build-time and deploy-time configuration parameters can be supplied this way.

### Node.js Environment Variables

When running the application in Angular Universal mode within a _Node.js_ environment, we can additionally access the process environment variables via _process.env._ This method provides a way to configure the application at deploy time, e.g., when using docker images. Configuration can then be consumed and passed to the client side via means of state transfer.

### NgRx Configuration State

Previous ways were mainly handling deployment- or build-time-related means to configure an Angular application. All further configuration that has some kind of runtime flexibility, especially configuration that is retrieved via REST calls from the ICM, has to be handled in the NgRx store and to be used throughout the application with selectors. Effects and actions should be used to manipulate those settings.

### URL Parameters

A configuration effect (NgRx) for listening to route parameters when initially visiting the page has been composed. This provides the most flexible way of configuring the application at runtime.

## Different Levels of Configuration Settings

### Build Settings

One example for a build time configuration is the property `serviceWorker`, which is managed in the _environment.ts_ and used to activate the `ServiceWorker` module. Another example of such a build setting is the property `production` as multiple debug modules are only compiled into the application when running in development mode.

In general, properties available at build time can only be supplied by Angular CLI environments (see above).

### Deployment Settings

Deployment settings do not influence the build process and therefore can be set in more flexible manners. The main criteria of this category is the fact that deployment settings do not change during runtime. The most common way of supplying them can be implemented by using Angular CLI environment files and `InjectionToken`s for distribution throughout the application's code.

An example for this kind of settings are breakpoint settings for the different device classes of the application touchpoints.

### Runtime Settings

The most flexible kind of settings, which can also change when the application runs, are runtime settings. Angular CLI environment files cannot provide a way to handle those. Only the NgRx store can do that. Therefore only NgRx means should be used to supply them. Nevertheless, default values can be provided by environment files and can later be overridden by system environment variables.

Everything managed in the NgRx state is accumulated on the server side and sent to the client side with the initial HTML response. The reason for this is that this is the most common deployment scenario of PWAs (see ).

## Multi-Site Handling

Since version 0.9 of the PWA there are means to dynamically configure ICM channel and application to determine the correct REST endpoint for each incoming top level request. Nevertheless, you can still configure it in a static way for each PWA deployment via Angluar CLI environments.

### Setting the Base URL

At first, the PWA has to be connected with the corresponding ICM. This can be done by modifying environment files or by setting the environment variable `ICM_BASE_URL` for the process running the _Node.js_ server. The latter is the preferred way.

Independent of where and how you deploy the Angular Universal application, be it in a docker container or plain, running on Azure, with or without service orchestrator, setting the base URL provides the most flexible way of configuring the PWA. Refer to the documentation for mechanisms of your environment on how to set and pass environment variables.

### Static Setting for Channels

Use the properties `icmChannel` and `icmApplication` in the Angular CLI environment or the environment variables `ICM_CHANNEL` and `ICM_APPLICATION` to statically direct one deployment to a specific REST endpoint of the ICM.

### Dynamic Setting of Channels

To set ICM channels and applications dynamically, you have to use URL rewriting in a reverse proxy running in front of the PWA instances. The values have to be provided as URL parameters (not to be confused with query parameters).

**nginx URL rewrite snippet**

````typescript
rewrite ^(.*)$ "$1;channel=inSPIRED-inTRONICS_Business-Site;application=-" break;
````

The above example configuration snippet shows a [Nginx](https://en.wikipedia.org/wiki/Nginx) rewrite rule on how to map an incoming top level request URL to an internal worker process, e.g., _Node.js_. It shows both the PWA parameters `channel`, `application` and their fixed example values. The parameters of each incoming request are then read and transferred to the NgRx store to be used for the composition of the initial HTML response on the server side. Afterwards they are propagated to the client side and re-used for subsequent REST requests.

In the source code of the project we supplied an extended [Nginx](https://en.wikipedia.org/wiki/Nginx) docker image for easy configuration of multiple channels via sub-domains. Refer to our Gitlab CI configuration (file _.gitlab-ci.yml)_ for a usage example.

## Feature Toggles

To activate additional functionality, we use the concept of feature toggles throughout the application. For instance, there is no general distinction between B2B and B2C applications. Each setup can define specific features at any time. Of course, the ICM server must supply appropriate REST resources to leverage functionality.

### Configuring Features

The configuration of features can be done statically by the Angular CLI environment property `features` (string array) or the environment parameter `FEATURES` (comma-separated string list). To configure it dynamically, use the PWA URL parameter `features` (comma-separated string list) during URL rewriting in the reverse proxy.

### Programmatically Switching Features

Various means to activate and deactivate functionality based on feature toggles are supplied.

**Guard**

````typescript
const routes: Routes = [
  {
    path: 'quote',
    loadChildren: ...,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'quoting' },
  },
...
````

Add the Guard as `CanActivate` to the routing definition. Additionally, you have to supply a `data` field called `feature`, containing a string that determines for which feature the route should be active. If the feature is deactivated, the user is sent to the error page on accessing.

**Directive**

````html
<ish-product-add-to-compare *ishFeature="'compare'"> ...
````

**Service**

````typescript
@Injectable({ providedIn: 'root' })
export class SomeService {
  constructor(private featureToggleService: FeatureToggleService) {}
...
    if (this.featureToggleService.enabled('quoting')) {
...
}
````

## Setting Default Locale

You can set the default locale statically by modifying the order of the provided locales in the Angular CLI environment files. The first locale is always chosen as the default one. To dynamically set the default locale, use the URL parameter `lang` when rewriting the URL in the reverse proxy (see Dynamic Setting of Channels).

## Extend Locales

To add other languages except English, German or French, you have to create a new json-mapping-file with all translations, e.g., _./src/assets/i18n/nl\_NL.json_). Add the locale in the file _./src/environment/environments.ts_. Additionally, for Angular's built-in components, e.g., currency-pipe, you have to register locale data similar to `localeDe` and `localeFr` with `registerLocaleData(localeNl)` in _./src/app/core/configuration.module.ts._

````typescript
...
import localeNl from '@angular/common/locales/nl';
...
export class ConfigurationModule {
  constructor(@Inject(LOCALE_ID) lang: string, translateService: TranslateService) {
    registerLocaleData(localeNl);
    ...
  }
}
````

> #### Configuration REST Resource
> We are currently planning to implement a Configuration REST resource in the ICM so that all necessary runtime configuration can be defined in the ICM Backoffice and consumed by each PWA deployment.
