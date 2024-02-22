import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { OciConfigurationMappingRepeatFieldComponent } from './oci-configuration-mapping-repeat-field.component';

describe('Oci Configuration Mapping Repeat Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forChild({
          types: [{ name: 'repeat-oci-configuration-mapping', component: OciConfigurationMappingRepeatFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [OciConfigurationMappingRepeatFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: { mappings: '' },
      fields: [
        {
          key: 'repeat',
          type: 'repeat-oci-configuration-mapping',
        },
      ],
      form: new FormGroup({}),
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
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-oci-configuration-mapping-repeat-field')).toBeTruthy();
  });
});
