import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

import { AccountPaymentConcardisDirectdebitComponent } from './account-payment-concardis-directdebit.component';

describe('Account Payment Concardis Directdebit Component', () => {
  let component: AccountPaymentConcardisDirectdebitComponent;
  let fixture: ComponentFixture<AccountPaymentConcardisDirectdebitComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AccountPaymentConcardisDirectdebitComponent, MockComponent(ModalDialogLinkComponent)],
    }).compileComponents();
  }));

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
          value: 'mandate text',
        },
        {
          name: 'mandateCreatedDateTime',
          value: 'Aug 15, 2020',
        },
      ],
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
