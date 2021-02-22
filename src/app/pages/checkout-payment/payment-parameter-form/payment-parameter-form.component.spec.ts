import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';

import { PaymentParameterFormComponent } from './payment-parameter-form.component';

describe('Payment Parameter Form Component', () => {
  let component: PaymentParameterFormComponent;
  let fixture: ComponentFixture<PaymentParameterFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({ types: [{ name: 'example', component: FormlyTestingExampleComponent }] }),
        FormlyTestingComponentsModule,
      ],
      declarations: [MockComponent(CheckboxComponent), MockPipe(TranslatePipe), PaymentParameterFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentParameterFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.paymentMethod = {
      id: 'ISH_INVOICE',
      serviceId: 'ISH_INVOICE',
      displayName: 'Invoice',
      saveAllowed: false,
      parameters: [
        {
          key: 'ex1',
          type: 'example',
        },
      ],
    };

    component.parentForm = new FormGroup({});
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
