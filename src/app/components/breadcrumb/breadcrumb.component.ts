import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';

/**
 * ng2-breadcrumb reference
 * This component shows a breadcrumb trail for available routes the router can navigate to.
 * It subscribes to the router in order to update the breadcrumb trail as you navigate to a component.
 */
@Component({
  selector: 'is-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  public _urls: string[] = [];
  public _routerSubscription: any;

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this._routerSubscription = this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      if (navigationEnd instanceof NavigationEnd) {
        this._urls.length = 0; // Fastest way to clear out array
        this.generateBreadcrumbTrail(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
      }
    });
  }

  generateBreadcrumbTrail(url: string): void {
    if (!this.breadcrumbService.isRouteHidden(url)) {
      // Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
      this._urls.unshift(url);
    }

    if (url.lastIndexOf('/') > 0) {
      this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/'))); // Find last '/' and add everything before it as a parent route
    }
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  friendlyName(url: string): string {
    return !url ? '' : this.breadcrumbService.getFriendlyNameForRoute(url);
  }

  ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }
}
