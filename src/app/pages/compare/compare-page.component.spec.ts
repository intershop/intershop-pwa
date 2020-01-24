import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { AddToCompare } from 'ish-core/store/shopping/compare';
import { LoadProductSuccess } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ComparePageComponent } from './compare-page.component';
import { ProductCompareListComponent } from './product-compare-list/product-compare-list.component';

describe('Compare Page Component', () => {
  let fixture: ComponentFixture<ComparePageComponent>;
  let element: HTMLElement;
  let component: ComparePageComponent;
  let store$: TestStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComparePageComponent, MockComponent(ProductCompareListComponent)],
      imports: [
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
    }).compileComponents();
    store$ = TestBed.get(TestStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display compare product list when no compare products available', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toBeEmpty();
  });

  it('should display compare product list when compare products available', () => {
    store$.dispatch(new LoadProductSuccess({ product: { sku: '1' } as Product }));
    store$.dispatch(new LoadProductSuccess({ product: { sku: '2' } as Product }));
    store$.dispatch(new AddToCompare({ sku: '1' }));
    store$.dispatch(new AddToCompare({ sku: '2' }));

    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-product-compare-list']);
  });

  it('should dispatch an action if removeProductCompare is called', () => {
    const storeSpy = spy(TestBed.get(Store));
    component.removeFromCompare('111');
    verify(storeSpy.dispatch(anything())).called();
  });
});
