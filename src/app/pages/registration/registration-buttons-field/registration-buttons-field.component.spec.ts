import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';
import { Subject } from 'rxjs';
import { spy, verify } from 'ts-mockito';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { RegistrationButtonsFieldComponent } from './registration-buttons-field.component';

const submittedSubject$ = new Subject();

const eventEmitter = new EventEmitter<void>();

describe('Registration Buttons Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'registration-buttons', component: RegistrationButtonsFieldComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [MockPipe(TranslatePipe), RegistrationButtonsFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const testComponentInputs = {
      model: {},
      form: new FormGroup({}),
      fields: [
        {
          type: 'registration-buttons',
          templateOptions: {
            submitted$: submittedSubject$.asObservable(),
            onCancel: () => eventEmitter.emit(),
          },
        },
      ],
    };

    component.testComponentInputs = testComponentInputs;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelectorAll('ish-registration-buttons-field')).toBeTruthy();
  });

  it('should call cancel function on button click', fakeAsync(() => {
    fixture.detectChanges();
    const spiedEmitter = spy(eventEmitter);
    const button = fixture.debugElement.nativeElement.querySelector('.btn-secondary');
    button.click();
    tick(500);
    verify(spiedEmitter.emit()).once();
  }));
});
