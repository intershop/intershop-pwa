import { Injectable } from '@angular/core';

@Injectable()
export class BreadcrumbService {
  public hideRoutesRegex: any = new Array<string>('/KATEGORIE$', '/category$', '/en_US$', '/USD$', '/de_DE$', '/EUR$'); // To hide these words in breadcrumbs

  /**
   * Returns true if a route should be hidden.
   */
  isRouteHidden(route: string): boolean {
    let hide = false;
    this.hideRoutesRegex.forEach((value: any) => {
      if (new RegExp(value).exec(route)) {
        hide = true;
      }
    });
    return hide;
  }
}
