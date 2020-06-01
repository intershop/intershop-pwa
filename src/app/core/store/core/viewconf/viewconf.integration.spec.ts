import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { ViewconfEffects } from './viewconf.effects';
import { getBreadcrumbData, getHeaderType, getWrapperClass } from './viewconf.selectors';

describe('Viewconf Integration', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router', 'viewconf'], [ViewconfEffects]),
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
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
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
