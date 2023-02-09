import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { Basket } from 'ish-core/models/basket/basket.model';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';

import { BasketMerchantMessageViewComponent } from './basket-merchant-message-view.component';

describe('Basket Merchant Message View Component', () => {
  let component: BasketMerchantMessageViewComponent;
  let fixture: ComponentFixture<BasketMerchantMessageViewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [BasketMerchantMessageViewComponent, InfoBoxComponent],
    }).compileComponents();
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
