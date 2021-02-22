import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { SelectOrderTemplateModalComponent } from '../../../shared/select-order-template-modal/select-order-template-modal.component';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item.component';

describe('Account Order Template Detail Line Item Component', () => {
  let component: AccountOrderTemplateDetailLineItemComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.select('quantity')).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [
        AccountOrderTemplateDetailLineItemComponent,
        MockComponent(FaIconComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockComponent(SelectOrderTemplateModalComponent),
        MockPipe(DatePipe),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: OrderTemplatesFacade, useFactory: () => instance(mock(OrderTemplatesFacade)) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateDetailLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.orderTemplateItemData = {
      id: '1234',
      sku: 'abdc',
      creationDate: 123124124,
      desiredQuantity: { value: 1 },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
