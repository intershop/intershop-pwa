import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { BasketValidationItemsComponent } from './basket-validation-items.component';

describe('Basket Validation Items Component', () => {
  let component: BasketValidationItemsComponent;
  let fixture: ComponentFixture<BasketValidationItemsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketValidationItemsComponent,
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketValidationItemsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything if there are no validation items', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should display an validation line item if there is a validation item', () => {
    component.lineItems = [BasketMockData.getBasketItem()];

    fixture.detectChanges();

    expect(element.querySelector('.list-header')).toBeTruthy();
    expect(element.querySelector('.list-body')).toBeTruthy();
    expect(element.querySelector('.product-id').innerHTML).toContain('4713');
    expect(element.querySelector('[data-testing-id="delete-button"]')).toBeTruthy();
  });

  it('should emit deleteItem event if called', () => {
    const eventEmitter$ = spy(component.deleteItem);

    component.lineItems = [BasketMockData.getBasketItem()];
    fixture.detectChanges();

    component.onDeleteItem('4713');

    verify(eventEmitter$.emit('4713')).once();
  });
});
