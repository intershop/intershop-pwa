import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { PunchoutFacade } from '../../../facades/punchout.facade';
import { OciConfigurationRepeatFieldComponent } from '../formly/oci-configuration-repeat-field/oci-configuration-repeat-field.component';

import { OciConfigurationFormComponent } from './oci-configuration-form.component';

describe('Oci Configuration Form Component', () => {
  let component: OciConfigurationFormComponent;
  let fixture: ComponentFixture<OciConfigurationFormComponent>;
  let element: HTMLElement;
  let punchoutFacade: PunchoutFacade;

  beforeEach(async () => {
    punchoutFacade = mock(PunchoutFacade);
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, NgbPopover, OciConfigurationFormComponent],
      providers: [
        {
          provide: FORMLY_CONFIG,
          multi: true,
          useValue: {
            types: [{ name: 'repeat-oci-config', component: OciConfigurationRepeatFieldComponent }],
          },
        },
        { provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) },
        provideRouter([]),
        provideTranslateService(),
      ],
    })
      .overrideComponent(OciConfigurationFormComponent, {
        remove: { imports: [ErrorMessageComponent, LoadingComponent] },
        add: { imports: [MockComponent(ErrorMessageComponent), MockComponent(LoadingComponent)] },
      })
      .compileComponents();
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

  it('should display the configuration items after creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('formly-form')).toBeTruthy();
  });

  it('should display a loading overlay if the configuration is loading', () => {
    when(punchoutFacade.ociConfigurationLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should submit a form when the user applies the changes', () => {
    fixture.detectChanges();

    when(punchoutFacade.updateOciConfiguration(anything()));

    component.submitForm();
    verify(punchoutFacade.updateOciConfiguration(anything())).once();
  });
});
