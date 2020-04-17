<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Mocking REST API Calls

Sometimes during development it might be necessary to work with mocked data.
This is especially necessary when developing new features in parallel where backend and frontend are involved.
In the PWA we supply a mocking mechanism so the frontend team can start implementation with mocked data until the backend implementation is finished.

## Switching On Mocking

Mocking complete REST responses can be configured in _environment.ts_.
The property `mockServerAPI` switches between mocking all calls (true) and only mocking paths that have to be mocked because they do not yet exist in the [REST API](http://developer.cloud.intershop.com).
The property `mustMockPaths` is an array of regular expressions for paths that have to be mocked, regardless if `mockServerAPI` is enabled or disabled.

## Supply Mocked Data

Mocked data is put in the folder _assets/mock-data/<path>_.
The path is the full path to the endpoint of the service without additional arguments.
The JSON response is put into a file called _get.json_ in the respective folder.

Switching to mocked REST API calls is done by the `MockInterceptor` which reads all the configuration and acts accordingly.
