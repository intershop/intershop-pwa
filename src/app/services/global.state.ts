import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CacheCustomService } from './cache/cache-custom.service';
import { CrossTabCommunicator } from './cross-tab-communicator';

@Injectable()
export class GlobalState {

  private _data = new Subject<Object>();
  private _dataStream$ = this._data.asObservable();
  private _subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

  /**
   * @param  {CacheCustomService} privatecacheService
   * @param  {CrossTabCommunicator} private_crossTabCommunicator
   */
  constructor(private cacheService: CacheCustomService, private _crossTabCommunicator: CrossTabCommunicator) {
    this._dataStream$.subscribe((data) => this._onEvent(data));
    this._crossTabCommunicator.subscribe('globalstate', (data: any) => {
      this.notifyDataChanged(data['event'], data['data']);
    });
  }

  /**
   * @param  {} event
   * @param  {} value
   * @param  {} notifyOtherTabs=false
   */
  notifyDataChanged(event, value, notifyOtherTabs = false) {

    this._data[event] = value;
    this.cacheService.storeDataToCache(value, event);
    this._data.next({
      event: event,
      data: this._data[event]
    });

    // TODO: the cross tab notification logic need to be to be revisited
    // once caching strategie is finalized (as localStorage has limit 0f 5MB)
    if (notifyOtherTabs) {
      this._crossTabCommunicator.notify(
        'globalstate', {
          event: event,
          data: this._data[event]
        });
    }
  }

  /**
   * @param  {string} event
   * @param  {Function} callback
   */
  subscribe(event: string, callback: Function) {
    const subscribers = this._subscriptions.get(event) || [];
    subscribers.push(callback);
    this._subscriptions.set(event, subscribers);
  }

  /**
   * @param  {any} data
   */
  _onEvent(data: any) {
    const subscribers = this._subscriptions.get(data['event']) || [];
    subscribers.forEach((callback) => {
      callback.call(null, data['data']);
    });
  }

  /**
   * @param  {string} event
   * @param  {Function} callback
   */
  subscribeCachedData(event: string, callback: Function) {
    callback(this.cacheService.getCachedData(event) || null);
  }

}
