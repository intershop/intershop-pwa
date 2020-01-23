# Angular Universal

Angular Universal is set up in this project mainly following [https://github.com/angular/universal-starter](https://github.com/angular/universal-starter).

Official documentation can be found at [https://angular.io/guide/universal](https://angular.io/guide/universal).

We use Universal for pre-rendering complete pages to tackle SEO concerns. An Angular application without Universal support will not respond to web crawlers with complete indexable page responses.

Angular's state transfer mechanism is used to transfer properties to the client side. We use it to de-hydrate the ngrx state in the server application and re-hydrate it on the client side. See [Using TransferState API in an Angular v5 Universal App](https://blog.angularindepth.com/using-transferstate-api-in-an-angular-5-universal-app-130f3ada9e5b) for specifics.

Follow the steps in the [README.md](https://github.com/intershop/intershop-pwa/blob/develop/README.md) to build and run the application in Universal mode.
