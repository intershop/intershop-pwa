import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CacheCustomService } from './cache/cache-custom.service';

@Injectable()
export class GlobalState {

    private _data = new Subject<Object>();
    private _dataStream$ = this._data.asObservable();

    private _subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

    constructor(private cacheService: CacheCustomService) {
        this._dataStream$.subscribe((data) => this._onEvent(data));
    }

    notifyDataChanged(event, value) {

        let current = this._data[event];
        this._data[event] = value;
        this.cacheService.storeDataToCache(value, event);
        this._data.next({
            event: event,
            data: this._data[event]
        });
    }

    subscribe(event: string, callback: Function) {
        let subscribers = this._subscriptions.get(event) || [];
        subscribers.push(callback);

        this._subscriptions.set(event, subscribers);
    }

    subscribeCachedData(event: string, callback: Function) {
        callback(this.cacheService.getCachedData(event) || []);
    }

    _onEvent(data: any) {
        let subscribers = this._subscriptions.get(data['event']) || [];
        subscribers.forEach((callback) => {
            callback.call(null, data['data']);
        });
    }
}
