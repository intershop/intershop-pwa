import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LogEffects } from '../../../utils/dev/log.effects';
import { coreReducers } from '../core.system';
import { RoutingDataActionTypes } from './routing-data.actions';
import { RoutingDataEffects } from './routing-data.effects';
import { getRoutingData } from './routing-data.selectors';

describe('Routing Data Integration', () => {
  let store$: LogEffects;
  let router: Router;

  beforeEach(() => {
    // tslint:disable-next-line:use-component-change-detection
    @Component({ template: 'dummy' })
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [
            {
              path: 'a',
              component: DummyComponent,
              data: { dataA: true },
              children: [
                {
                  path: 'aa',
                  component: DummyComponent,
                  data: { dataAA: 'hello' },
                },
                {
                  path: 'ab',
                  component: DummyComponent,
                  data: { dataAA: 'hello' },
                },
              ],
            },
            {
              path: 'b',
              component: DummyComponent,
              data: { dataB: 1 },
            },
          ],
          { paramsInheritanceStrategy: 'always' }
        ),
        StoreModule.forRoot(coreReducers),
        EffectsModule.forRoot([RoutingDataEffects, LogEffects]),
      ],
    });

    store$ = TestBed.get(LogEffects);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(store$).toBeTruthy();
  });

  it(
    'should work for route /a',
    fakeAsync(() => {
      router.navigate(['/a']);
      tick(1000);

      // fires once
      const iter = store$.actionsIterator([/.*/]);
      expect(iter.next().type).toEqual(RoutingDataActionTypes.SetRoutingData);
      expect(iter.next()).toBeUndefined();

      expect(getRoutingData<boolean>('dataA')(store$.state)).toBeTrue();
      expect(getRoutingData<string>('dataAA')(store$.state)).toBeUndefined();
      expect(getRoutingData<number>('dataB')(store$.state)).toBeUndefined();
    })
  );

  it(
    'should work for route /a/aa sequentially',
    fakeAsync(() => {
      router.navigate(['/a']);
      tick(1000);
      router.navigate(['/a/aa']);
      tick(1000);

      expect(getRoutingData<boolean>('dataA')(store$.state)).toBeTrue();
      expect(getRoutingData<string>('dataAA')(store$.state)).toEqual('hello');
      expect(getRoutingData<number>('dataB')(store$.state)).toBeUndefined();

      // fires twice
      const iter = store$.actionsIterator([/.*/]);
      expect(iter.next().type).toEqual(RoutingDataActionTypes.SetRoutingData);
      expect(iter.next().type).toEqual(RoutingDataActionTypes.SetRoutingData);
      expect(iter.next()).toBeUndefined();
    })
  );

  it(
    'should work for route /a/aa directly',
    fakeAsync(() => {
      router.navigate(['/a/aa']);
      tick(1000);

      expect(getRoutingData<boolean>('dataA')(store$.state)).toBeTrue();
      expect(getRoutingData<string>('dataAA')(store$.state)).toEqual('hello');
      expect(getRoutingData<number>('dataB')(store$.state)).toBeUndefined();

      // fires once
      const iter = store$.actionsIterator([/.*/]);
      expect(iter.next().type).toEqual(RoutingDataActionTypes.SetRoutingData);
      expect(iter.next()).toBeUndefined();
    })
  );

  it(
    'should not trigger for switch between /a/aa and /a/ab',
    fakeAsync(() => {
      router.navigate(['/a/aa']);
      tick(1000);

      // fires once
      const iter = store$.actionsIterator([/.*/]);
      expect(iter.next().type).toEqual(RoutingDataActionTypes.SetRoutingData);
      expect(iter.next()).toBeUndefined();

      expect(getRoutingData<boolean>('dataA')(store$.state)).toBeTrue();
      expect(getRoutingData<string>('dataAA')(store$.state)).toEqual('hello');
      expect(getRoutingData<number>('dataB')(store$.state)).toBeUndefined();

      tick(1000);
      router.navigate(['/a/ab']);
      tick(1000);

      // fires not again
      expect(iter.next()).toBeUndefined();

      expect(getRoutingData<boolean>('dataA')(store$.state)).toBeTrue();
      expect(getRoutingData<string>('dataAA')(store$.state)).toEqual('hello');
      expect(getRoutingData<number>('dataB')(store$.state)).toBeUndefined();
    })
  );

  it(
    'should work for route /b',
    fakeAsync(() => {
      router.navigate(['/b']);
      tick(1000);

      expect(getRoutingData<boolean>('dataA')(store$.state)).toBeUndefined();
      expect(getRoutingData<string>('dataAA')(store$.state)).toBeUndefined();
      expect(getRoutingData<number>('dataB')(store$.state)).toBe(1);

      // fires once
      const iter = store$.actionsIterator([/.*/]);
      expect(iter.next().type).toEqual(RoutingDataActionTypes.SetRoutingData);
      expect(iter.next()).toBeUndefined();
    })
  );
});
