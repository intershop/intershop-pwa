import { UrlMatcher } from '@angular/router';

export interface CustomRoute {
  matcher: UrlMatcher;
  formats: string[];
  generateUrl(...args): string;
}
