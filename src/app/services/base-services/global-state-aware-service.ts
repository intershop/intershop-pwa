import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import * as crosstablib from 'crosstab';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../environments/environment';

@Injectable()
export class GlobalStateAwareService<T> {

  private _subject: BehaviorSubject<T>;

  constructor(private name: string, private crosstab: boolean, defaultValue: T = null) {
    this._subject = new BehaviorSubject(defaultValue);

    if (isPlatformBrowser(environment.platformId) && this.crosstab) {
      crosstablib.on(this.name, (message) => {
        // console.log(crosstab.id + ' received ' + message.data + ' from ' + message.origin);
        if (message.origin !== crosstablib.id) {
          this._subject.next(message.data);
        }
      });
    }
  }

  get current(): T {
    return this._subject.value;
  }

  subscribe(callback: (data: T) => void) {
    this._subject.subscribe(callback);
  }

  next(data: T) {
    // console.error('data of ' + this._name + ' is now ' + data);
    this._subject.next(data);
    if (isPlatformBrowser(environment.platformId) && this.crosstab) {
      try {
        crosstablib.broadcast(this.name, data);
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}
