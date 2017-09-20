import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationExtras, NavigationStart, Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { LocalizeParser } from './localize-router.parser';

/**
 * Localization service
 * modifyRoutes
 */
@Injectable()
export class LocalizeRouterService {
  routerEvents: Subject<string>;

  /**
   * CTOR
   * @param parser
   * @param router
   */
  constructor(public parser: LocalizeParser, private router: Router) {
    this.routerEvents = new Subject<string>();
  }

  /**
   * Start up the service
   */
  init(): void {
    this.router.resetConfig(this.parser.routes);
    this.router.events.subscribe(this._routeChanged());
  }

  /**
   * Change language and navigate to translated route
   * @param lang
   * @param extras
   */
  changeLanguage(locale: any, extras?: NavigationExtras): Observable<boolean> {
    return Observable.create(observer => {
      if (locale.lang !== this.parser.currentLang) {
        const rootSnapshot: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
        this.parser.translateRoutes(locale.lang).subscribe(() => {
          this.router.navigateByUrl(this.traverseRouteSnapshot(rootSnapshot), extras);
          observer.next(true);
          observer.complete();
        });
      }
    });
  }

  /**
   * Traverses through the tree to assemble new translated url
   * @param snapshot
   * @returns {string}
   */
  private traverseRouteSnapshot(snapshot: ActivatedRouteSnapshot): string {
    if (snapshot.firstChild && snapshot.firstChild.routeConfig && snapshot.firstChild.routeConfig.path) {
      return this.parseSegmentValue(snapshot) + '/' + this.traverseRouteSnapshot(snapshot.firstChild);
    }
    return this.parseSegmentValue(snapshot);
  }

  /**
   * Extracts new segment value based on routeConfig and url
   * @param snapshot
   * @returns {string}
   */
  private parseSegmentValue(snapshot: ActivatedRouteSnapshot): string {
    if (snapshot.routeConfig) {
      const subPathSegments = snapshot.routeConfig.path.split('/');
      return subPathSegments.map((s: string, i: number) => s.indexOf(':') === 0 ? snapshot.url[i].path : s).join('/');
    }
    return '';
  }

  /**
   * Translate route to current language
   * If new language is explicitly provided then replace language part in url with new language
   * @param path
   * @returns {string | any[]}
   */
  translateRoute(path: string | any[]): string | any[] {
    if (typeof path === 'string') {
      const translatedRoute = this.parser.translateRoute(path);
      return !path.indexOf('/') ? `/${this.parser.urlPrefix()}${translatedRoute}` : translatedRoute;
    }
    // it's an array
    const result: any[] = [];
    (path as Array<any>).forEach((segment: any, index: number) => {
      if (typeof segment === 'string') {
        const res = this.parser.translateRoute(segment);
        if (!index && !segment.indexOf('/')) {
          result.push(`/${this.parser.urlPrefix()}${res}`);
        } else {
          result.push(res);
        }
      } else {
        result.push(segment);
      }
    });
    return result;
  }

  /**
   * Event handler to react on route change
   * @returns {(event:any)=>void}
   * @private
   */
  private _routeChanged(): ((event: any) => void) {
    const self = this;

    return (event: any) => {
      const lang = this.parser.getLocationLang(event.url);
      if (event instanceof NavigationStart && lang && lang !== this.parser.currentLang) {
        this.parser.translateRoutes(lang).subscribe(() => {
          // Fire route change event
          this.routerEvents.next(lang);
        });
      }
      // This value does not exist in Router before version 4
      // so we have to find it indirectly
      if (event.toString().match(/RouteConfigLoadEnd/)) {
        Observable.of(event.route).toPromise().then(function (route) {
          self.parser.initChildRoutes(route._loadedConfig.routes);
        });
      }
    };
  }
}
