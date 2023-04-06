import { inject } from '@angular/core';

import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

/**
 * Redirects to the error page if the current route could not be found
 */
export function notFoundStatusGuard() {
  const httpStatusCodeService = inject(HttpStatusCodeService);

  return httpStatusCodeService.setStatus(404, false);
}
