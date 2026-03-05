import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Basket } from 'ish-core/models/basket/basket.model';

import { BasketMerchantMessageViewComponent } from './basket-merchant-message-view.component';

describe('Basket Merchant Message View Component', () => {
  let component: BasketMerchantMessageViewComponent;
  let fixture: ComponentFixture<BasketMerchantMessageViewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketMerchantMessageViewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display messageToMerchant', () => {
    component.data = {} as Basket;
    component.messageToMerchant = 'This is your message';
    fixture.detectChanges();

    const messageToMerchantElement = fixture.debugElement.query(By.css(`[data-testing-id= "message-to-merchant"]`));
    expect(messageToMerchantElement).not.toBeNull();
    expect(messageToMerchantElement.nativeElement.textContent).toBe('This is your message');
  });
});
