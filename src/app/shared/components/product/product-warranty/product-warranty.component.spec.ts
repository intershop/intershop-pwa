import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductWarrantyDetailsComponent } from 'ish-shared/components/product/product-warranty-details/product-warranty-details.component';

import { ProductWarrantyComponent } from './product-warranty.component';

describe('Product Warranty Component', () => {
  let component: ProductWarrantyComponent;
  let fixture: ComponentFixture<ProductWarrantyComponent>;
  let element: HTMLElement;
  let productContext: ProductContextFacade;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    productContext = mock(ProductContextFacade);
    shoppingFacade = mock(ShoppingFacade);
    when(productContext.select('product')).thenReturn(of({} as ProductView));

    when(productContext.select('product')).thenReturn(
      of({
        availableWarranties: [
          {
            id: '1YearSupport',
            name: '1 Year Support',
            price: {
              value: 100,
              currency: 'USD',
              type: 'Money',
            },
          },
        ],
      } as ProductView)
    );

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(ProductWarrantyDetailsComponent), MockPipe(PricePipe), ProductWarrantyComponent],
      providers: [
        { provide: ProductContextFacade, useFactory: () => instance(productContext) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWarrantyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit new warranty if warranty is changed', () => {
    const emitter = spy(component.submitWarranty);
    component.submitSelectedWarranty('1YearSupport');

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`"1YearSupport"`);
  });

  it('should render a no-warranty option if warranties exist on the product', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('input')[0].value).toContain('noWarranty');
    expect(element.getElementsByTagName('input')[1].value).toContain('1YearSupport');
  });

  it('should only render the component if warranties are available', () => {
    when(productContext.select('product')).thenReturn(of({ availableWarranties: [] } as ProductView));
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });
});
