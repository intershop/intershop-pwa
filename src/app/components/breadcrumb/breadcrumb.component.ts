import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';

class BreadCrumbLinkNames {
  name: string;
  link: string;
  constructor(name: string, link: string) {
    this.name = name;
    this.link = link;
  }
}

/**
 * ng2-breadcrumb reference
 * This component shows a breadcrumb trail for available routes the router can navigate to.
 * It subscribes to the router in order to update the breadcrumb trail as you navigate to a component.
 */
@Component({
  selector: 'is-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})

export class BreadcrumbComponent implements OnInit, OnChanges, OnDestroy {

  // public _urls: string[] = [];
  public _urls: BreadCrumbLinkNames[] = [];
  public _routerSubscription: any;
  @Input() friendlyPath: string;
  @Input() startAfter: string;

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    if (!this.friendlyPath && !this.startAfter) {
      this.generateBreadcrumbTrail(this.router.url, this.router.url);
    }
    this._routerSubscription = this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      if (navigationEnd instanceof NavigationEnd) {
        this._urls.length = 0; // Fastest way to clear out array
        this.generateBreadcrumbTrail(this.getUrlWithNames(navigationEnd.url), navigationEnd.url);
      }
    });
  }

  ngOnChanges(): void {
    this._urls.length = 0;
    this.generateBreadcrumbTrail(this.getUrlWithNames(this.router.url), this.router.url);
  }

  getUrlWithNames(url): string {
    if (this.friendlyPath && this.startAfter) {
      const base = '/' + this.startAfter + '/';
      url = url.substr(0, url.indexOf(base) + base.length) + this.friendlyPath;
    }
    return url;
  }

  generateBreadcrumbTrail(urlWithNames: string, urlWithIds: string): void {
    if (!this.breadcrumbService.isRouteHidden(urlWithNames)) {
      // Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
      this._urls.unshift(new BreadCrumbLinkNames(urlWithNames, urlWithIds));
    }

    if (urlWithNames.lastIndexOf('/') > 0) {
      this.generateBreadcrumbTrail(urlWithNames.substr(0, urlWithNames.lastIndexOf('/')), urlWithIds.substr(0, urlWithIds.lastIndexOf('/'))); // Find last '/' and add everything before it as a parent route
    }

  }

  friendlyName(url: string): string {
    return !url ? '' : decodeURIComponent(url.substr(url.lastIndexOf('/') + 1, url.length));
  }

  ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }
}


