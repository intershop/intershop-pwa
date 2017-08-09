import {DataEmitterService} from './data-emitter.service';

describe('DataEmitterService test', () => {
  let dataEmitService: DataEmitterService;

  beforeEach(() => {
    dataEmitService = new DataEmitterService();
  });

  it('return some value when call addToCart', () => {
    let retVal = null;
    dataEmitService.miniCartEmitter.subscribe(value => retVal = value);

    dataEmitService.addToCart('Test Data');

    expect(retVal).not.toBeNull();
  });

  it('return some value when call addToWishList', () => {
    let retVal = null;
    dataEmitService.wishListEmitter.subscribe(value => retVal = value);

    dataEmitService.addToWishList('Test Data');

    expect(retVal).not.toBeNull();
  });

  it('return some value when call pushData', () => {
    let retVal = null;
    dataEmitService.emitter.subscribe(value => retVal = value);

    dataEmitService.pushData('Test Data');

    expect(retVal).not.toBeNull();
  });

  it('return some value when call addToCompare', () => {
    let retVal = null;
    dataEmitService.comparerListEmitter.subscribe(value => retVal = value);

    dataEmitService.addToCompare('Test Data');

    expect(retVal).not.toBeNull();
  });
});
