<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# ICM HTTP Error Mapping

The ICM provides a big variety of different REST resources managed by various teams and services.
As the maturity of resources varies, so does the format of HTTP errors provided by those endpoints.
The classic error response was submitted via HTTP headers and slowly the new format of providing even localized messages in the body of an error is being implemented.
For the PWA this means that potentially every service and component managing a different resource has to handle different formats.
In version 0.23 of the PWA we refactored the error handling to provide a consistent simplified format for all HTTP errors throughout the application.

## Implementation

Most of the work is done by the [HttpInterceptor](https://angular.io/api/common/http/HttpInterceptor) [ICMErrorMapperInterceptor][icm-error-mapper-interceptor].
It converts responses with `error-key` headers, responses with `errors` body and also provides a fallback mapping for errors not matching this format.

> :bulb: Mapping the [HttpErrorResponse](https://angular.io/api/common/http/HttpErrorResponse) is mandatory as the object itself is not serializable and should therefor not be pushed into the [State Management](../concepts/state-management.md)!

If necessary, you can provide a custom [SPECIAL_HTTP_ERROR_HANDLER][icm-error-mapper-interceptor] for a specific use case.
All custom mappers should be provided in the [ConfigurationModule](../../src/app/core/configuration.module.ts).

[icm-error-mapper-interceptor]: ../../src/app/core/interceptors/icm-error-mapper.interceptor.ts
