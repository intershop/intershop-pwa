import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BasketItem } from '../../../../models/basket-item/basket-item.model';
import { BasketItemDescriptionComponent } from './basket-item-description.component';

describe('BasketItemDescriptionComponent', () => {
  let component: BasketItemDescriptionComponent;
  let fixture: ComponentFixture<BasketItemDescriptionComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), PopoverModule.forRoot()],
        declarations: [BasketItemDescriptionComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketItemDescriptionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pli = {
      id: '4712',
      product: { sku: '4713' },
      availability: true,
      inStock: true,
    } as BasketItem;
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
