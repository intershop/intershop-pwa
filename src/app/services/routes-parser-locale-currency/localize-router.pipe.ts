import { PipeTransform, Pipe, Injectable, ChangeDetectorRef } from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';

@Injectable()
@Pipe({
  name: 'localize',
  pure: false // required to update the value when the promise is resolved
})
export class LocalizeRouterPipe implements PipeTransform {
  private value: string | any[] = '';
  private lastKey: string | any[];
  private lastLanguage: string;
  private subscription: Subscription;

  /**
   * CTOR
   * @param localize
   * @param _ref
   */
  constructor(private localize: LocalizeRouterService, private _ref: ChangeDetectorRef) {
    this.subscription = this.localize.routerEvents.subscribe(() => {
      this.transform(this.lastKey);
    });
  }

  /**
   * Transform current url to localized one
   * @param query
   * @returns {string | any[]}
   */
  transform(query: string | any[]): string | any[] {
    if (!query || query.length === 0 || !this.localize.parser.currentLang) {
      return query;
    }
    if (equals(query, this.lastKey) && equals(this.lastLanguage, this.localize.parser.currentLang)) {
      return this.value;
    }
    this.lastKey = query;
    this.lastLanguage = this.localize.parser.currentLang;

    /** translate key and update values */
    this.value = this.localize.translateRoute(query);
    this.lastKey = query;
    this._ref.markForCheck();

    return this.value;
  }
}


export function equals(o1: any, o2: any): boolean {
  if (o1 === o2) {
    return true;
  }
  if (o1 === null || o2 === null) {
    return false;
  }
  if (o1 !== o1 && o2 !== o2) {
    return true; // NaN === NaN
  }
  const t1 = typeof o1;
  const t2 = typeof o2;

  let length: number;
  let key: any;
  let keySet: any;

  if (t1 === t2 && t1 === 'object') {
    if (Array.isArray(o1)) {
      if (!Array.isArray(o2)) {
        return false;
      }
      if ((length = o1.length) === o2.length) {
        for (key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) {
            return false;
          }
        }
        return true;
      }
    } else {
      if (Array.isArray(o2)) {
        return false;
      }
      keySet = Object.create(null);
      for (key in o1) {
        if (o1.hasOwnProperty(key)) {
          if (!equals(o1[key], o2[key])) {
            return false;
          }
          keySet[key] = true;
        }
      }
      for (key in o2) {
        if (o2.hasOwnProperty(key)) {
          if (!(key in keySet) && typeof o2[key] !== 'undefined') {
            return false;
          }
        }
      }
      return true;
    }
  }
  return false;
}
