---
applyTo: '**/*.ts'
---

## Error Handling Patterns

### Service Error Handling

- **Always validate inputs:** Throw descriptive errors for missing required parameters

### Effect Error Handling

- **Use mapErrorToAction:** Convert HTTP errors to failure actions; it rethrows all other errors
- **Expected non-HTTP errors:** Map errors the effect provokes itself, e.g. by `timeout`, with `catchError` to the failure action
- **Handle specific error cases:** Check error status and provide appropriate feedback
- **Maintain observable stream:** Always return valid actions, never throw in effects

### Error Message Display

- **Use ErrorMessageComponent:** For displaying HTTP errors
- **Toast notifications:** For non-critical errors via MessageFacade
- **Validation errors:** Use form validation and field-level error display

### HTTP Error Patterns

- **Specialized handlers:** Use SpecialHttpErrorHandler for custom error mapping
- **Error codes:** Map backend error codes to user-friendly messages
- **Skip error handling:** Use `skipApiErrorHandling: true` when needed

## Examples

- [ApiService](../../src/app/core/services/api/api.service.ts)
- [ICMErrorMapperInterceptor](../../src/app/core/interceptors/icm-error-mapper.interceptor.ts)
