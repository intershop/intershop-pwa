import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DataEmitterService {
  miniCartEmitter = new EventEmitter();
  wishListEmitter = new EventEmitter();
  comparerListEmitter = new EventEmitter();
  emitter = new EventEmitter();

  /**
   * push data event emitter
   * @param  {any} objectParam
   */
  pushData(objectParam: any) {
    this.emitter.emit(objectParam);
  }

  /**
   * Add to cart event emitter
   * @param  {any} item
   */
  addToCart(item: any) {
    this.miniCartEmitter.emit(item);
  }

  /**
   * add to wish list event emitter
   * @param  {any} item
   */
  addToWishList(item: any) {
    this.wishListEmitter.emit(item);
  }

  /**
   * add to compare event emitter
   * @param  {any} item
   */
  addToCompare(item: any) {
    this.comparerListEmitter.emit(item);
  }

}
