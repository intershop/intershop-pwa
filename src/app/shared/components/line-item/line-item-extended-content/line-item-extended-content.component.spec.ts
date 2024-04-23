import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, ngMocks } from 'ng-mocks';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LineItemExtendedContentEntryComponent } from 'ish-shared/components/line-item/line-item-extended-content-entry/line-item-extended-content-entry.component';

import { LineItemExtendedContentComponent } from './line-item-extended-content.component';

describe('Line Item Extended Content Component', () => {
  let component: LineItemExtendedContentComponent;
  let fixture: ComponentFixture<LineItemExtendedContentComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      declarations: [LineItemExtendedContentComponent, MockComponent(LineItemExtendedContentEntryComponent)],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemExtendedContentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.lineItem = {
      id: '123',
      quantity: { value: 3 },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display extended content entries', () => {
    fixture.detectChanges();

    expect(ngMocks.findAll(LineItemExtendedContentEntryComponent).map(c => c.componentInstance.key))
      .toMatchInlineSnapshot(`
      [
        "partialOrderNo",
        "customerProductID",
      ]
    `);
  });

  it('should trigger line item updates if entry components emit changes', () => {
    fixture.detectChanges();

    ngMocks.find(LineItemExtendedContentEntryComponent).componentInstance.updateValue.emit('654321');

    verify(checkoutFacade.updateBasketItem(anything())).once();
    expect(capture(checkoutFacade.updateBasketItem).last()[0]).toMatchInlineSnapshot(`
      {
        "itemId": "123",
        "partialOrderNo": "654321",
        "quantity": 3,
      }
    `);
  });
});
