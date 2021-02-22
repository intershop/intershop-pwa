import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';

import { BasketValidationItemsComponent } from './basket-validation-items.component';

describe('Basket Validation Items Component', () => {
  let component: BasketValidationItemsComponent;
  let fixture: ComponentFixture<BasketValidationItemsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BasketValidationItemsComponent,
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockDirective(ProductContextDirective),
        MockPipe(PricePipe),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

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
