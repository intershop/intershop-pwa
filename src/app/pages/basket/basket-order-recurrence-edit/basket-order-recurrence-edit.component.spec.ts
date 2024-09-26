import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { BasketOrderRecurrenceEditComponent } from './basket-order-recurrence-edit.component';

describe('Basket Order Recurrence Edit Component', () => {
  let component: BasketOrderRecurrenceEditComponent;
  let fixture: ComponentFixture<BasketOrderRecurrenceEditComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [BasketOrderRecurrenceEditComponent],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketOrderRecurrenceEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
