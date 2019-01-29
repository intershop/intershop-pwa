import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { RegistrationCompanyFormComponent } from './registration-company-form.component';

describe('Registration Company Form Component', () => {
  let component: RegistrationCompanyFormComponent;
  let fixture: ComponentFixture<RegistrationCompanyFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-input',
          template: 'Input component',
          inputs: ['controlName', 'form', 'label', 'errorMessages'],
        }),
        RegistrationCompanyFormComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationCompanyFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show form fields after creation ', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('ish-input')).toHaveLength(1);
  });
});
