import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { LocalizeRouterSettings } from './localize-router.config';

interface ILocales {
  lang: string;
  currency: string;
}

/**
 * Abstract class for parsing localization
 */
@Injectable()
export abstract class LocalizeParser {
  currentLang: string;
  localesCollection: Array<ILocales>;
  pattern: string;
  routes: Routes;
  defaultLang: string;

  langs: Array<string>;
  protected prefix: string;

  private _translationObject: any;
  private _wildcardRoute: Route;
  private _languageRoute: Route;

  /**
   * Loader constructor
   * @param translate
   * @param location
   * @param settings
   */
  constructor(private translate: TranslateService,
    private location: Location,
    private settings: LocalizeRouterSettings) {
  }

  /**
   * Load routes and fetch necessary data
   * @param routes
   * @returns {Promise<any>}
   */
  abstract load(routes: Routes): Promise<any>;

  /**
   * Initialize language and routes
   * @param routes
   * @returns {Promise<any>}
   */
  protected init(routes: Routes): Promise<any> {
    let selectedLanguage: string;

    this.langs = <any>_.map(this.localesCollection, 'lang');
    this.routes = routes;

    if (!this.langs || !this.langs.length) {
      return Promise.resolve();
    }
    /** detect current language */
    const locationLang = this.getLocationLang();
    const browserLang = this._getBrowserLang();

    this.defaultLang = browserLang || this.langs[0];

    selectedLanguage = locationLang || this.defaultLang;

    this.translate.setDefaultLang(this.defaultLang);

    let children: Routes = [];
    /** if set prefix is enforced */
    if (this.settings.alwaysSetPrefix) {
      const baseRoute = { path: '', redirectTo: this.urlPrefix(this.defaultLang), pathMatch: 'full' };

      /** extract potential wildcard route */
      const wildcardIndex = routes.findIndex((route: Route) => route.path === '**');
      if (wildcardIndex !== -1) {
        this._wildcardRoute = routes.splice(wildcardIndex, 1)[0];
      }
      children = this.routes.splice(0, this.routes.length, baseRoute);
    } else {
      children = [...this.routes]; // shallow copy of routes
    }

    /** append children routes */
    if (children && children.length) {
      if (this.langs.length > 1 || this.settings.alwaysSetPrefix) {
        this._languageRoute = { children: children };
        this.routes.unshift(this._languageRoute);
      }
    }

    /** ...and potential wildcard route */
    if (this._wildcardRoute && this.settings.alwaysSetPrefix) {
      this.routes.push(this._wildcardRoute);
    }

    /** translate routes */
    const res = this.translateRoutes(selectedLanguage);
    return res.toPromise();
  }

  initChildRoutes(routes: Routes) {
    if (!this._translationObject) {
      // not lazy, it will be translated in main init
      return routes;
    }

    this._translateRouteTree(routes);
    return routes;
  }

  /**
   * Translate routes to selected language
   * @param language
   * @returns {Promise<any>}
   */
  translateRoutes(language: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>) => {

      if (this._languageRoute) {
        this._languageRoute.path = this.urlPrefix(language);
      }

      this.translate.use(language).subscribe((translations: any) => {
        this._translationObject = translations;
        this.currentLang = language;

        if (this._languageRoute) {
          if (this._languageRoute) {
            this._translateRouteTree(this._languageRoute.children);
          }
          // if there is wildcard route
          if (this._wildcardRoute && this._wildcardRoute.redirectTo) {
            this._translateProperty(this._wildcardRoute, 'redirectTo', true);
          }
        } else {
          this._translateRouteTree(this.routes);
        }

        observer.next(void 0);
        observer.complete();
      });
    });
  }

  /**
   * Translate the route node and recursively call for all it's children
   * @param routes
   * @private
   */
  private _translateRouteTree(routes: Routes): void {
    routes.forEach((route: Route) => {
      if (route.path && route.path !== '**') {
        this._translateProperty(route, 'path');
      }
      if (route.redirectTo) {
        this._translateProperty(route, 'redirectTo', !route.redirectTo.indexOf('/'));
      }
      if (route.children) {
        this._translateRouteTree(route.children);
      }
      if (route.loadChildren && (<any>route)._loadedConfig) {
        this._translateRouteTree((<any>route)._loadedConfig.routes);
      }
    });
  }

  /**
   * Translate property
   * If first time translation then add original to route data object
   * @param route
   * @param property
   * @param prefixLang
   * @private
   */
  private _translateProperty(route: Route, property: string, prefixLang?: boolean): void {
    // set property to data if not there yet
    const routeData: any = route.data = route.data || {};
    if (!routeData.localizeRouter) {
      routeData.localizeRouter = {};
    }
    if (!routeData.localizeRouter[property]) {
      routeData.localizeRouter[property] = (<any>route)[property];
    }

    const result = this.translateRoute(routeData.localizeRouter[property]);
    (<any>route)[property] = prefixLang ? `/${this.urlPrefix()}${result}` : result;
  }

  urlPrefix(lang: string = this.currentLang) {
    const _lang = lang;
    let _currency: string;
    let obj;

    if (this.prefix) {
      obj = _.find(this.localesCollection, (o: any) => {
        return o.lang === lang;
      });

      _currency = _.has(obj, 'currency') && obj !== 'undefined' ? obj.currency : '';

      return this.settings.alwaysSetPrefix || this.currentLang !== this.defaultLang ?
        `${this.pattern.slice().replace(/{LANG}/, _lang).replace(/{CURRENCY}/, _currency)}` : '';
    } else {
      return this.settings.alwaysSetPrefix || this.currentLang !== this.defaultLang ? lang : '';
    }
  }

  get currentLocale() {
    return _.find(this.localesCollection, (p) => {
      return (p.lang === this.currentLang);
    });
  }
  /**
   * Translate route and return observable
   * @param path
   * @returns {string}
   */
  translateRoute(path: string): string {
    const queryParts = path.split('?');
    if (queryParts.length > 2) {
      const strError = 'There should be only one query parameter block in the URL';
      throw strError;
    }
    const pathSegments = queryParts[0].split('/');

    /** collect observables  */
    return pathSegments
      .map((part: string) => part.length ? this.translateText(part) : part)
      .join('/') +
      (queryParts.length > 1 ? `?${queryParts[1]}` : '');
  }

  /**
   * Get language from url
   * @returns {string}
   * @private
   */
  getLocationLang(url?: string): string {
    const queryParamSplit = (url || this.location.path()).split('?');
    let pathSlices: string[] = [];
    if (queryParamSplit.length > 0) {
      pathSlices = queryParamSplit[0].split('/');
    }
    if (pathSlices.length > 1 && this.langs.indexOf(pathSlices[1]) !== -1) {
      return pathSlices[1];
    }
    if (pathSlices.length && this.langs.indexOf(pathSlices[0]) !== -1) {
      return pathSlices[0];
    }
    return null;
  }

  /**
   * Get user's language set in the browser
   * @returns {string}
   * @private
   */
  private _getBrowserLang(): string {
    return this._returnIfInLocales(this.translate.getBrowserLang());
  }

  /**
   * Check if value exists in langs list
   * @param value
   * @returns {any}
   * @private
   */
  private _returnIfInLocales(value: string): string {
    if (value && this.langs.indexOf(value) !== -1) {
      return value;
    }
    return null;
  }

  /**
   * Get translated value
   * @param key
   * @returns {any}
   */
  private translateText(key: string): string {
    if (!this._translationObject) {
      return key;
    }
    const res = this._translationObject[this.prefix + key];
    return res || key;
  }
}

export class DummyLocalizeParser extends LocalizeParser {
  load(routes: Routes): Promise<any> {
    return new Promise((resolve: any) => {
      this.init(routes).then(resolve);
    });
  }
}
