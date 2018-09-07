import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormArray, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from '../../../../core/icon.module';
import { FormsSharedModule } from '../../../../forms/forms-shared.module';
import { BasketItemView } from '../../../../models/basket-item/basket-item.model';
import { Price } from '../../../../models/price/price.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { PipesModule } from '../../../pipes.module';

import { LineItemListComponent } from './line-item-list.component';

describe('Line Item List Component', () => {
  let component: LineItemListComponent;
  let fixture: ComponentFixture<LineItemListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LineItemListComponent,
        MockComponent({
          selector: 'ish-line-item-description',
          template: 'Line Item Description Component',
          inputs: ['pli'],
        }),
        MockComponent({
          selector: 'ish-product-image',
          template: 'Product Image Component',
          inputs: ['product'],
        }),
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule, FormsSharedModule, PipesModule, IconModule],
      providers: [FormBuilder],
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
        singleBasePrice: { value: 3, currencyMnemonic: 'USD' },
        price: { value: 3, currencyMnemonic: 'USD' },
        totals: {},
      } as BasketItemView,
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
    expect(element.getElementsByTagName('ish-product-image')[0].textContent).toContain('Product Image Component');
    expect(element.getElementsByTagName('ish-line-item-description')[0].textContent).toContain(
      'Line Item Description Component'
    );
  });

  it('should throw updateItem event when form group item changes', done => {
    let firedItem = {} as { itemId: string; quantity: number };
    component.lineItems = [
      {
        id: 'IID',
        quantity: { value: 1, type: 'quantity' },
        product: { maxOrderQuantity: 2 },
      } as BasketItemView,
    ];

    component.updateItem.subscribe(item => {
      firedItem = item;
      done();
    });

    component.ngOnChanges();

    (component.form.controls.items as FormArray).controls[0].patchValue({ quantity: 2 });
    fixture.detectChanges();

    expect(firedItem.itemId).toBe('IID');
    expect(firedItem.quantity).toBe(2);
  });

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
      expect(!!element.querySelector('ish-input[controlname=quantity]')).toBeTruthy();
    });

    it('should not render item quantity change input field if editable === false', () => {
      component.editable = false;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(!!element.querySelector('ish-input[controlname=quantity]')).not.toBeTruthy();
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
