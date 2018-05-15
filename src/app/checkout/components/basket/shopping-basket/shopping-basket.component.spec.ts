import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FormsSharedModule } from '../../../../forms/forms-shared.module';
import { PipesModule } from '../../../../shared/pipes.module';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ShoppingBasketComponent } from './shopping-basket.component';

describe('Shopping Basket Component', () => {
  let component: ShoppingBasketComponent;
  let fixture: ComponentFixture<ShoppingBasketComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          ShoppingBasketComponent,
          MockComponent({ selector: 'ish-modal-dialog', template: 'Modal Component' }),
          MockComponent({ selector: 'ish-product-image', template: 'Product Image Component', inputs: ['product'] }),
          MockComponent({
            selector: 'ish-basket-item-description',
            template: 'Basket Item Description Component',
            inputs: ['pli'],
          }),
          MockComponent({
            selector: 'ish-basket-cost-summary',
            template: 'Basket Cost Summary Component',
            inputs: ['basket'],
          }),
        ],
        imports: [TranslateModule.forRoot(), RouterTestingModule, FormsSharedModule, PipesModule],
        providers: [FormBuilder],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.ngOnChanges();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create a basket quantities form on basket change', () => {
    expect(component.form).toBeUndefined();
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.form.get('items')).toBeTruthy();
    expect(component.form.get('items').value.length).toEqual(1);
  });

  it('should render sub components if basket changes', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')[0].textContent).toContain('Product Image Component');
    expect(element.getElementsByTagName('ish-basket-item-description')[0].textContent).toContain(
      'Basket Item Description Component'
    );
  });

  it('should throw deleteItem event when delete item is clicked', () => {
    let firedItem = '';
    component.deleteItem.subscribe(itemId => {
      firedItem = itemId;
    });

    component.onDeleteItem('4712');
    expect(firedItem).toBe('4712');
  });

  it('should throw updateItems event when form is submitted', () => {
    component.ngOnChanges();
    let firedFormValue = '';
    component.updateItems.subscribe(x => {
      firedFormValue = x;
    });

    component.submitForm();
    expect(firedFormValue).toBe(component.form.value.items);
  });
});
