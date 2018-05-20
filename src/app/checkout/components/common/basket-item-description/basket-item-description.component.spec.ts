import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PipesModule } from '../../../../shared/pipes.module';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { BasketItemDescriptionComponent } from './basket-item-description.component';

describe('Basket Item Description Component', () => {
  let component: BasketItemDescriptionComponent;
  let fixture: ComponentFixture<BasketItemDescriptionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), PopoverModule.forRoot(), PipesModule],
      declarations: [
        BasketItemDescriptionComponent,
        MockComponent({
          selector: 'ish-product-shipment',
          template: 'Product Shipment Component',
          inputs: ['product'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketItemDescriptionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pli = BasketMockData.getBasketItem();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display sku for the basket item', () => {
    fixture.detectChanges();
    expect(element.querySelector('.product-id').innerHTML).toContain('4713');
  });

  it('should display in stock for the basket item', () => {
    fixture.detectChanges();
    expect(element.querySelector('.product-in-stock')).toBeTruthy();
  });
});
