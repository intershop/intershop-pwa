import { Route } from '@angular/router';
import { of } from 'rxjs';

import { SelectivePreloadingStrategy } from './selective-preloading-strategy';

describe('Selective Preloading Strategy', () => {
  let strategy: SelectivePreloadingStrategy;
  let loadFn: jest.Mock;

  beforeEach(() => {
    strategy = new SelectivePreloadingStrategy();
    loadFn = jest.fn(() => of('loaded'));
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(strategy).toBeTruthy();
  });

  describe('eager preloading', () => {
    it('should preload route with preload: eager after short delay', done => {
      const route: Route = { path: 'home', data: { preload: 'eager' } };

      strategy.preload(route, loadFn).subscribe(result => {
        expect(loadFn).toHaveBeenCalled();
        expect(result).toBe('loaded');
        done();
      });

      jest.advanceTimersByTime(100);
    });

    it('should not preload immediately', () => {
      const route: Route = { path: 'home', data: { preload: 'eager' } };

      strategy.preload(route, loadFn).subscribe();

      expect(loadFn).not.toHaveBeenCalled();
    });
  });

  describe('lazy preloading', () => {
    it('should preload route with preload: lazy after longer delay', done => {
      const route: Route = { path: 'account', data: { preload: 'lazy' } };

      strategy.preload(route, loadFn).subscribe(result => {
        expect(loadFn).toHaveBeenCalled();
        expect(result).toBe('loaded');
        done();
      });

      jest.advanceTimersByTime(3000);
    });

    it('should not preload before delay', () => {
      const route: Route = { path: 'account', data: { preload: 'lazy' } };

      strategy.preload(route, loadFn).subscribe();

      jest.advanceTimersByTime(2999);
      expect(loadFn).not.toHaveBeenCalled();
    });
  });

  describe('no preloading', () => {
    it('should not preload route without preload data', done => {
      const route: Route = { path: 'checkout' };

      strategy.preload(route, loadFn).subscribe(result => {
        expect(loadFn).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should not preload route with unknown preload value', done => {
      const route: Route = { path: 'checkout', data: { preload: 'unknown' } };

      strategy.preload(route, loadFn).subscribe(result => {
        expect(loadFn).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should not preload route with preload: false', done => {
      const route: Route = { path: 'checkout', data: { preload: false } };

      strategy.preload(route, loadFn).subscribe(result => {
        expect(loadFn).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        done();
      });
    });
  });
});
