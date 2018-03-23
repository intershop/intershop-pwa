import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { CoreState } from '../../../core/store/core.state';
import { Product } from '../../../models/product/product.model';
import { findAllIshElements } from '../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../utils/dev/mock.component';
import { navigateMockAction } from '../../../utils/dev/navigate-mock.action';
import { LoadProduct, LoadProductSuccess } from '../../store/products';
import { shoppingReducers } from '../../store/shopping.system';
import { ProductPageContainerComponent } from './product-page.container';

describe('Product Page Container', () => {
  let component: ProductPageContainerComponent;
  let fixture: ComponentFixture<ProductPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<CoreState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          routerReducer
        })
      ],
      declarations: [
        MockComponent({ selector: 'ish-breadcrumb', template: 'Breadcrumb Component', inputs: ['category', 'categoryPath', 'product'] }),
        MockComponent({ selector: 'ish-product-detail', template: 'Category Page Component', inputs: ['product'] }),
        MockComponent({ selector: 'ish-recently-viewed', template: 'Recently Viewed Component', inputs: ['products', 'product'] }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        ProductPageContainerComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when neither product nor loading is set', () => {
    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual([]);
  });

  it('should display loading when product is loading', () => {
    store$.dispatch(new LoadProduct('dummy'));

    fixture.detectChanges();

    expect(component.productLoading$).toBeObservable(cold('a', { a: true }));
    expect(findAllIshElements(element)).toEqual(['ish-loading']);
  });

  it('should display product-detail when product is available', () => {
    const product = { sku: 'dummy' } as Product;
    store$.dispatch(new LoadProductSuccess(product));
    const routerAction = navigateMockAction({
      url: `/product/${product.sku}`,
      params: { sku: product.sku }
    });
    store$.dispatch(routerAction);

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-breadcrumb', 'ish-product-detail', 'ish-recently-viewed']);
  });
});
