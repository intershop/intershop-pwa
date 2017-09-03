import { Injectable, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { EventAggregator } from './event-aggregator';

@Injectable()
export class CrossTabCommunicator {
    private _emptyValue = '__empty__';
    private _events: EventAggregator = new EventAggregator();
    private _nameCollisionPreventionPrefix = 'crossTabKey';

    constructor( @Inject(PLATFORM_ID) private platformId: Object) {
        this.registerStorgaeEventListner();
        this.sendSessionDataRequest();
    }

    /**
  * Funtion for subscribing cross tab communication event.
  * @param  {string} eventName
  * @param  {Function} callback
  * @returns void
  */
    public subscribe(eventName: string, callback: Function): void {
        this._events.registerEvent(this._nameCollisionPreventionPrefix + eventName, callback);
    }

    /**
* Funtion for publishing cross tab event.
* @param  {string} eventName
* @param  {any} value
* @returns void
*/
    public notify(eventName: string, value: any): void {
        eventName = this._nameCollisionPreventionPrefix + eventName;
        value = this.transformToEmptyIfNull(value);
        localStorage.setItem(eventName, JSON.stringify(value));
        localStorage.removeItem(eventName);
    }

    /**
* Function to send request to already opened tab for publishing session
* storge data (if any) through localStorage event.
* @returns void
*/
    private sendSessionDataRequest(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (!sessionStorage.length) {
                localStorage.setItem('getSessionStorage', Date.now().toString());
            }
        }
    }

    /**
* Function register listener on storage event
*  @returns void
*/
    private registerStorgaeEventListner(): void {
        if (isPlatformBrowser(this.platformId)) {
            const storageEvent = Observable.fromEvent(window, 'storage');
            storageEvent.subscribe((event: any) => {
                this.handleStorageEvent(event);
            });
        }
    }

    /**
* Function for handling storge events which get raised when any value get update to the localstorage
* @param  {any} event
* @returns void
*/
    private handleStorageEvent(event: any): void {
        const sessionStorageInitialized = 'sessionStorageInitialized';

        switch (event.key) {
            // handling for request by new tab  for session data
            case 'getSessionStorage': {
                if (isPlatformBrowser(this.platformId)) {
                    localStorage.setItem(sessionStorageInitialized, JSON.stringify(sessionStorage));
                    localStorage.removeItem(sessionStorageInitialized);
                }
                break;
            }
            // handling  for response data from already opened tab from on session data request.
            case sessionStorageInitialized: {
                if (isPlatformBrowser(this.platformId)) {
                    if (!sessionStorage.length && event.newValue) {
                        const data = JSON.parse(event.newValue);
                        for (const key of Object.keys(data)) {
                            sessionStorage.setItem(key, data[key]);
                        }
                        this._events.fireEvent(event.key, data);
                    }
                }
                break;
            }
            // publish-subscribe pattern is used where all the subscribe get notified based on event key.
            default: {
                if (event.newValue && event.key.startsWith(this._nameCollisionPreventionPrefix)) {
                    const newValue = this.transformToNullIfEmpty(event.newValue);
                    this._events.fireEvent(event.key, JSON.parse(newValue));
                }
            }
        }
    }

    /**
    * The function tranform  null to _emptyValue.
   * @param  {any} value
   * @returns any
   */
    private transformToEmptyIfNull(value: any): any {
        if (!value) {
            value = this._emptyValue;
        }
        return value;
    }

    /**
* The function tranform to _emptyValue to null.
* @param  {string} value
* @returns any
*/
    private transformToNullIfEmpty(value: string): any {
        if (value === this._emptyValue) {
            value = null;
        }
        return value;
    }
}



