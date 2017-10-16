import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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

export class BreadcrumbComponent implements OnInit, OnChanges, OnDestroy {

  public _urls: { name: string, link: string }[] = [];
  public _routerSubscription: any;
  @Input() categoryNames: string[];
  @Input() startAfter: string;

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    if (!this.inputsToBeUSed()) {
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
    if (this.inputsToBeUSed()) {
      url = url.substr(0, url.indexOf(this.startAfter) + this.startAfter.length) + this.categoryNames.map(segment => encodeURIComponent(segment)).join('/');
    }
    return url;
  }

  /**
   * Generate breadcrumbs based on given url
   * @param  {string} urlWithNames
   * @param  {string} urlWithIds
   * @returns void
   */
  generateBreadcrumbTrail(urlWithNames: string, urlWithIds: string): void {
    if (!this.breadcrumbService.isRouteHidden(urlWithNames)) {
      // Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
      this._urls.unshift({ name: urlWithNames, link: urlWithIds });
    }

    if (urlWithNames.lastIndexOf('/') > 0) {
      this.generateBreadcrumbTrail(this.removeLastSegment(urlWithNames), this.removeLastSegment(urlWithIds));
      // Find last '/' and add everything before it as a parent route
    }
  }

  /**
   * Returns name to be shown on html
   * @param  {string} url
   * @returns string
   */
  friendlyName(url: string): string {
    // Forward slash '/' in category name is decoded
    return !url ? '' : decodeURIComponent(url.substr(url.lastIndexOf('/') + 1, url.length));
  }

  ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

  /**
   * Returns true if inputs to the component are available otherwise false
   * @returns boolean
   */
  inputsToBeUSed(): boolean {
    return !!(this.categoryNames && this.startAfter);
  }

  /**
   * Removes the part of the string after last forward slash
   * @param  {string} url
   * @returns string
   */
  removeLastSegment(url: string): string {
    return url.substr(0, url.lastIndexOf('/'));
  }
}
