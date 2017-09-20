import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PopoverConfig } from 'ngx-bootstrap/popover';
import { GlobalState } from './services';
import { LocalizeRouterService } from './services/routes-parser-locale-currency/localize-router.service';

export function getPopoverConfig(): PopoverConfig {
  return Object.assign(new PopoverConfig(), { placement: 'top', triggers: 'hover', container: 'body' });
}

@Component({
  selector: 'is-root',
  templateUrl: './app.component.html',
  providers: [
    { provide: PopoverConfig, useFactory: getPopoverConfig }
  ]
})

export class AppComponent implements OnInit {
  public showBreadCrumb = false;

  // TODO: is this the right place to handle the global application translation?
  constructor(private localize: LocalizeRouterService, private _router: Router, private globalState: GlobalState) {
    console.log('ROUTES', this.localize.parser.routes);
  }

  showRoute(activatedUrl: string): boolean {
    const pages = this.globalState.breadcrumbPages;
    return pages.some((page) => {
      return activatedUrl.indexOf(page) > -1;
    });
  }

  ngOnInit() {
    // Decides whether Breadcrumbs are to be shown on a page or not.
    this._router.events.subscribe((event) => {
      this.showBreadCrumb = false;
      if (event instanceof NavigationEnd && this.showRoute(event.urlAfterRedirects)) {
        this.showBreadCrumb = true;
      }
    });
  }
}
