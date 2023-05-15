import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { PunchoutFacade } from '../../../facades/punchout.facade';
import { OciConfigurationRepeatFieldComponent } from '../formly/oci-configuration-repeat-field/oci-configuration-repeat-field.component';

import { OciConfigurationFormComponent } from './oci-configuration-form.component';

describe('Oci Configuration Form Component', () => {
  let component: OciConfigurationFormComponent;
  let fixture: ComponentFixture<OciConfigurationFormComponent>;
  let element: HTMLElement;
  let punchoutFacade: PunchoutFacade;

  const formlyConfig: ConfigOption = {
    types: [
      {
        name: 'repeatOciConfig',
        component: MockComponent(OciConfigurationRepeatFieldComponent),
      },
    ],
  };

  beforeEach(async () => {
    punchoutFacade = mock(PunchoutFacade);
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forChild(formlyConfig),
        FormlyTestingModule,
        NgbPopoverModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        OciConfigurationFormComponent,
      ],
      providers: [{ provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OciConfigurationFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(punchoutFacade.ociConfiguration$()).thenReturn(of([]));
    when(punchoutFacade.ociFormatterSelectOptions$).thenReturn(of([]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
