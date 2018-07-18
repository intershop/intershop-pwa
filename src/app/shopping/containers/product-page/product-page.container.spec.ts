import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jest-marbles';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CoreState } from '../../../core/store/core.state';
import { coreReducers } from '../../../core/store/core.system';
import { Product } from '../../../models/product/product.model';
import { quotingReducers } from '../../../quoting/store/quoting.system';
import { FeatureToggleModule } from '../../../shared/feature-toggle.module';
import { findAllIshElements } from '../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../utils/dev/mock.component';
import { LoadProduct, LoadProductSuccess, SelectProduct } from '../../store/products';
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
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
          quoting: combineReducers(quotingReducers),
        }),
        FeatureToggleModule.testingFeatures({ recently: true }),
        ModalModule.forRoot(),
      ],
      declarations: [
        ProductPageContainerComponent,
        MockComponent({
          selector: 'ish-breadcrumb',
          template: 'Breadcrumb Component',
          inputs: ['category', 'categoryPath', 'product'],
        }),
        MockComponent({ selector: 'ish-product-detail', template: 'Category Page Component', inputs: ['product'] }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        MockComponent({ selector: 'ish-recently-viewed-container', template: 'Recently Viewed Container' }),
        MockComponent({
          selector: 'ish-product-add-to-quote-dialog',
          template: 'Product Add To Quote Dialog',
          inputs: ['quote', 'quoteLoading'],
        }),
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

  it('should not display anything when neither product nor loading is set (only the recently viewed container)', () => {
    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-recently-viewed-container']);
  });

  it('should display loading when product is loading', () => {
    store$.dispatch(new LoadProduct('dummy'));

    fixture.detectChanges();

    expect(component.productLoading$).toBeObservable(cold('a', { a: true }));
    expect(findAllIshElements(element)).toEqual(['ish-loading', 'ish-recently-viewed-container']);
  });

  it('should display product-detail when product is available', () => {
    const product = { sku: 'dummy' } as Product;
    store$.dispatch(new LoadProductSuccess(product));
    store$.dispatch(new SelectProduct(product.sku));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual([
      'ish-breadcrumb',
      'ish-product-detail',
      'ish-recently-viewed-container',
    ]);
  });
});
