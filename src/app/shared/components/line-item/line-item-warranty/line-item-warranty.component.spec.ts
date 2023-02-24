import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductWarrantyDetailsComponent } from 'ish-shared/components/product/product-warranty-details/product-warranty-details.component';
import { ProductWarrantyComponent } from 'ish-shared/components/product/product-warranty/product-warranty.component';

import { LineItemWarrantyComponent } from './line-item-warranty.component';

describe('Line Item Warranty Component', () => {
  let component: LineItemWarrantyComponent;
  let fixture: ComponentFixture<LineItemWarrantyComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let checkoutFacade: CheckoutFacade;

  const pli = { id: 'pliId', warranty: { sku: 'war2' } } as LineItemView;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(
      of({ sku: 'prod1', availableWarranties: [{ id: 'war' }, { id: 'war2' }] } as ProductView)
    );

    checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basketLineItems$).thenReturn(of([pli]));

    await TestBed.configureTestingModule({
      declarations: [
        LineItemWarrantyComponent,
        MockComponent(ProductWarrantyComponent),
        MockComponent(ProductWarrantyDetailsComponent),
        MockPipe(PricePipe),
      ],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemWarrantyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.pli = pli;
    component.editable = true;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render the warranty selection if the warranty is editable', () => {
    fixture.detectChanges();

    expect(element.querySelector('ish-product-warranty')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="selectedPliWarranty"]')).toBeFalsy();
  });

  it('should render the pli warranty if the warranty is not editable', () => {
    component.editable = false;
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="selectedPliWarranty"]')).toBeTruthy();
    expect(element.querySelector('ish-product-warranty')).toBeFalsy();
  });

  it('should update warranty if updateLineItemWarranty is called', () => {
    when(checkoutFacade.updateBasketItemWarranty(anything(), anything())).thenReturn();

    component.updateLineItemWarranty('war2');

    verify(checkoutFacade.updateBasketItemWarranty(pli.id, 'war2')).once();
  });
});
