import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { coreReducers } from 'ish-core/store/core-store.module';

import { quotingReducers } from '../../../../store/quoting-store.module';
import { ProductAddToQuoteComponent } from '../../components/product-add-to-quote/product-add-to-quote.component';

import { ProductAddToQuoteContainerComponent } from './product-add-to-quote.container';

describe('Product Add To Quote Container', () => {
  let component: ProductAddToQuoteContainerComponent;
  let fixture: ComponentFixture<ProductAddToQuoteContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ ...coreReducers, quoting: combineReducers(quotingReducers) })],
      declarations: [MockComponent(ProductAddToQuoteComponent), ProductAddToQuoteContainerComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProductAddToQuoteContainerComponent);
        component = fixture.componentInstance;
        component.product = { sku: 'dummy' } as Product;
        element = fixture.nativeElement;
        store$ = TestBed.get(Store);
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should dispatch action when addToQuote is triggered.', () => {
    const storeSpy$ = spy(store$);

    component.addToQuote();

    verify(storeSpy$.dispatch(anything())).once();
  });
});
