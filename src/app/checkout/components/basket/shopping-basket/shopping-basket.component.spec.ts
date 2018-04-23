import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
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
        ],
        imports: [TranslateModule.forRoot()],
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
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
