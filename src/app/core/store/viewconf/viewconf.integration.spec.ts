import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ViewconfEffects } from './viewconf.effects';
import { viewconfReducer } from './viewconf.reducer';
import { getBreadcrumbData, getHeaderType, getWrapperClass } from './viewconf.selectors';

describe('Viewconf Integration', () => {
  let store$: TestStore;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        ...ngrxTesting({
          reducers: { viewconf: viewconfReducer },
          effects: [ViewconfEffects],
          routerStore: true,
        }),
        RouterTestingModule.withRoutes([
          {
            path: 'some',
            component: DummyComponent,
            data: {
              wrapperClass: 'something',
              headerType: 'simple',
              breadcrumbData: [{ text: 'TEXT' }],
            },
          },
          { path: '**', component: DummyComponent },
        ]),
      ],
    });

    store$ = TestBed.inject(TestStore);
    router = TestBed.inject(Router);
  });

  it('should extract wrapperClass from routing to state', fakeAsync(() => {
    router.navigateByUrl('/some');
    tick(500);

    expect(getWrapperClass(store$.state)).toEqual('something');
  }));

  it('should extract headerType from routing to state', fakeAsync(() => {
    router.navigateByUrl('/some');
    tick(500);

    expect(getHeaderType(store$.state)).toEqual('simple');
  }));

  it('should extract breadcrumbData from routing to state', fakeAsync(() => {
    router.navigateByUrl('/some');
    tick(500);

    expect(getBreadcrumbData(store$.state)).toEqual([{ text: 'TEXT' }]);
  }));

  it('should reset wrapperClass when no longer available in routing data', fakeAsync(() => {
    router.navigateByUrl('/some');
    tick(500);

    expect(getWrapperClass(store$.state)).toEqual('something');

    router.navigateByUrl('/other');
    tick(500);

    expect(getWrapperClass(store$.state)).toBeUndefined();
  }));
});
