import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { BasketPromotionComponent } from 'ish-shared/components/basket/basket-promotion/basket-promotion.component';
import { LineItemDescriptionComponent } from 'ish-shared/components/basket/line-item-description/line-item-description.component';
import { PromotionDetailsComponent } from 'ish-shared/components/promotion/promotion-details/promotion-details.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { LineItemListComponent } from './line-item-list.component';

describe('Line Item List Component', () => {
  let component: LineItemListComponent;
  let fixture: ComponentFixture<LineItemListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LineItemListComponent,
        MockComponent(BasketPromotionComponent),
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(LineItemDescriptionComponent),
        MockComponent(ProductImageComponent),
        MockComponent(PromotionDetailsComponent),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.lineItems = [
      {
        id: '4712',
        name: 'pli name',
        quantity: { value: 10 },
        product: { sku: '4713', availability: true, inStock: true },
        productSKU: '4713',
        singleBasePrice: { value: 3, currency: 'USD' },
        price: { value: 3, currency: 'USD' },
        totals: {},
      } as LineItemView,
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.ngOnChanges();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create a basket quantities form on basket change', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.form.get('items')).toBeTruthy();
    expect(component.form.get('items').value).toHaveLength(1);
  });

  it('should render sub components if basket changes', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(findAllIshElements(element)).toIncludeAllMembers(['ish-line-item-description', 'ish-product-image']);
  });

  it('should throw updateItem event when form group item changes', fakeAsync(() => {
    component.lineItems = [
      {
        id: 'IID',
        quantity: { value: 1, type: 'quantity' },
        product: { maxOrderQuantity: 2 },
      } as LineItemView,
    ];

    fixture.detectChanges();
    const emitter = spy(component.updateItem);

    // init form
    component.ngOnChanges();

    // change value
    (component.form.controls.items as FormArray).controls[0].patchValue({ quantity: 2 });
    tick(1500);

    verify(emitter.emit(anything())).once();
  }));

  it('should throw deleteItem event when delete item is clicked', done => {
    let firedItem = '';
    component.deleteItem.subscribe(itemId => {
      firedItem = itemId;
      done();
    });

    component.onDeleteItem('4712');
    expect(firedItem).toBe('4712');
  });

  describe('editable', () => {
    beforeEach(() => {
      component.editable = true;
    });

    it('should render item quantity change input field if editable === true', () => {
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('ish-input[controlname=quantity]')).toBeTruthy();
    });

    it('should not render item quantity change input field if editable === false', () => {
      component.editable = false;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('ish-input[controlname=quantity]')).not.toBeTruthy();
    });

    it('should render item delete button if editable === true', () => {
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon-prop="fas,trash-alt"]')).toBeTruthy();
    });

    it('should not render item delete button if editable === false', () => {
      component.editable = false;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon-prop="fas,trash-alt"]')).toBeFalsy();
    });
  });

  describe('totals', () => {
    it('should render totals if set', () => {
      component.total = { value: 1 } as Price;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.textContent).toContain('quote.items.total.label');
    });

    it('should not render totals if no line items present', () => {
      component.total = { value: 1 } as Price;
      component.lineItems = [];
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.textContent).not.toContain('quote.items.total.label');
    });
  });
});
