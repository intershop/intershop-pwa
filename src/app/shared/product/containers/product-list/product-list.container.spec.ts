import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { SetEndlessScrollingPageSize, SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductListPagingComponent } from '../../components/product-list-paging/product-list-paging.component';
import { ProductListToolbarComponent } from '../../components/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';

import { ProductListContainerComponent } from './product-list.container';

describe('Product List Container', () => {
  const TEST_ID = { type: 'test', value: 'dummy' };
  let component: ProductListContainerComponent;
  let fixture: ComponentFixture<ProductListContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        MockComponent(ProductListComponent),
        MockComponent(ProductListPagingComponent),
        MockComponent(ProductListToolbarComponent),
        ProductListContainerComponent,
      ],
    }).compileComponents();

    store$ = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListContainerComponent);
    component = fixture.componentInstance;
    component.id = TEST_ID;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges({})).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display components without paging on the page', () => {
    component.ngOnChanges({ id: new SimpleChange(undefined, TEST_ID, true) });
    fixture.detectChanges();

    expect(findAllIshElements(element)).toIncludeAllMembers(['ish-product-list', 'ish-product-list-toolbar']);
  });

  it('should display components with paging on the page if available', () => {
    store$.dispatch(new SetEndlessScrollingPageSize({ itemsPerPage: 1 }));
    store$.dispatch(new SetProductListingPages({ id: TEST_ID, itemCount: 30, sortKeys: [] }));

    component.ngOnChanges({ id: new SimpleChange(undefined, TEST_ID, true) });
    fixture.detectChanges();

    expect(findAllIshElements(element)).toIncludeAllMembers([
      'ish-product-list',
      'ish-product-list-toolbar',
      'ish-product-list-paging',
    ]);
  });
});
