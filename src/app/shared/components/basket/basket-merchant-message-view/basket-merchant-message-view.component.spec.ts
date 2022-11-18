import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMerchantMessageViewComponent } from './basket-merchant-message-view.component';

describe('Basket Merchant Message View Component', () => {
  let component: BasketMerchantMessageViewComponent;
  let fixture: ComponentFixture<BasketMerchantMessageViewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasketMerchantMessageViewComponent],
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
});
