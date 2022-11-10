import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMerchantMessageComponent } from './basket-merchant-message.component';

describe('BasketMerchantMessageComponent', () => {
  let component: BasketMerchantMessageComponent;
  let fixture: ComponentFixture<BasketMerchantMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasketMerchantMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketMerchantMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
