import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { ClearBasketComponent } from './clear-basket.component';

describe('Clear Basket Component', () => {
  let component: ClearBasketComponent;
  let fixture: ComponentFixture<ClearBasketComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      declarations: [ClearBasketComponent, MockComponent(ModalDialogComponent)],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();

    when(checkoutFacade.deleteBasketItems()).thenReturn(undefined);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display a button to trigger the clearing of the basket', () => {
    fixture.detectChanges();

    expect(element.querySelector('button[data-testing-id=clearBasketButton]')).toBeTruthy();
  });

  it('should call facade when triggered.', () => {
    component.clearBasket();

    verify(checkoutFacade.deleteBasketItems()).once();
  });
});
