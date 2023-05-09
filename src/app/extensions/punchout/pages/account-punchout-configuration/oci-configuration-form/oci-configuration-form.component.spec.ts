import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OciConfigurationRepeatFieldComponent } from '../formly/oci-configuration-repeat-field/oci-configuration-repeat-field.component';

import { OciConfigurationFormComponent } from './oci-configuration-form.component';

describe('Oci Configuration Form Component', () => {
  let component: OciConfigurationFormComponent;
  let fixture: ComponentFixture<OciConfigurationFormComponent>;
  let element: HTMLElement;

  const formlyConfig: ConfigOption = {
    types: [
      {
        name: 'repeat',
        component: MockComponent(OciConfigurationRepeatFieldComponent),
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forChild(formlyConfig),
        FormlyTestingModule,
        NgbPopoverModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [MockComponent(FaIconComponent), OciConfigurationFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OciConfigurationFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
