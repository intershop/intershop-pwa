import {Injectable, EventEmitter} from '@angular/core'

@Injectable()
export class DataEmitterService {
  miniCartEmitter = new EventEmitter();
  wishListEmitter = new EventEmitter();
  comparerListEmitter = new EventEmitter();
  emitter = new EventEmitter();

  pushData(objectParam) {
    this.emitter.emit(objectParam);
  }

  addToCart(item) {
    this.miniCartEmitter.emit(item);
  }

  addToWishList(item) {
    this.wishListEmitter.emit(item);
  }

  addToCompare(item) {
    this.comparerListEmitter.emit(item);
  }

}
