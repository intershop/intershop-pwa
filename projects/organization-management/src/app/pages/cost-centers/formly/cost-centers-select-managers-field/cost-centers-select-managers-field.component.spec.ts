import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';
import { ManagersSelectComponent } from 'organization-management';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { CostCentersSelectManagersFieldComponent } from './cost-centers-select-managers-field.component';

describe('Cost Centers Select Managers Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'select-manager', component: CostCentersSelectManagersFieldComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [CostCentersSelectManagersFieldComponent, MockComponent(ManagersSelectComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: {},
      form: new FormGroup({}),
      fields: [
        {
          key: 'select-manager',
          type: 'select-manager',
        },
      ],
    };
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.testComponentInputs = testComponentInputs;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('ish-cost-centers-select-managers-field')).toBeTruthy();
  });

  it('should render a select box after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=managers-select]')).toBeTruthy();
  });
});
