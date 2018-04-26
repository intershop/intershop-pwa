import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { FormsSharedModule } from '../../../../forms/forms-shared.module';
import { Basket } from '../../../../models/basket/basket.model';
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
        ],
        imports: [TranslateModule.forRoot(), PopoverModule.forRoot(), RouterTestingModule, FormsSharedModule],
        providers: [FormBuilder],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = {
      id: '4711',
      lineItems: [],
    } as Basket;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.ngOnChanges();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
