import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

import { AccountPaymentConcardisDirectdebitComponent } from './account-payment-concardis-directdebit.component';

describe('Account Payment Concardis Directdebit Component', () => {
  let component: AccountPaymentConcardisDirectdebitComponent;
  let fixture: ComponentFixture<AccountPaymentConcardisDirectdebitComponent>;
  let element: HTMLElement;

  const mandateTextValue = 'mandate_text';
  const mandateCreatedDateTimeValue = '1597644563000';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        AccountPaymentConcardisDirectdebitComponent,
        MockComponent(ModalDialogLinkComponent),
        MockPipe(DatePipe),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPaymentConcardisDirectdebitComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.paymentInstrument = {
      id: '4321',
      paymentMethod: 'Concardis_DirectDebit',
      parameters: [
        {
          name: 'mandateReference',
          value: 'mandate_reference',
        },
        {
          name: 'mandateText',
          value: mandateTextValue,
        },
        {
          name: 'mandateCreatedDateTime',
          value: mandateCreatedDateTimeValue,
        },
      ],
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show sepa mandate text on executing showSepaMandateText()', () => {
    fixture.detectChanges();
    component.showSepaMandateText();
    expect(element.querySelector('[data-testing-id="mandate-text"]')).toBeTruthy();
    expect(component.mandateText).toEqual(mandateTextValue);
    expect(component.mandateCreatedDateTime.toString()).toEqual(mandateCreatedDateTimeValue);
  });
});
