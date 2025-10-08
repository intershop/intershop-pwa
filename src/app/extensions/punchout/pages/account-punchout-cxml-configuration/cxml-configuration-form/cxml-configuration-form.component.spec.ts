import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { PunchoutFacade } from '../../../facades/punchout.facade';
import { CxmlConfiguration } from '../../../models/cxml-configuration/cxml-configuration.model';

import { CxmlConfigurationFormComponent } from './cxml-configuration-form.component';

describe('Cxml Configuration Form Component', () => {
  let component: CxmlConfigurationFormComponent;
  let fixture: ComponentFixture<CxmlConfigurationFormComponent>;
  let element: HTMLElement;
  let punchoutFacade: PunchoutFacade;

  beforeEach(async () => {
    punchoutFacade = mock(PunchoutFacade);
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [CxmlConfigurationFormComponent, MockComponent(ErrorMessageComponent), MockComponent(FormlyForm)],
      providers: [{ provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CxmlConfigurationFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.cxmlConfiguration = [{ name: 'test', value: 'test value' }] as CxmlConfiguration[];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the configuration values after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('formly-form')).toBeTruthy();
  });

  it('should submit a form when the user applies the changes', () => {
    when(punchoutFacade.updateCxmlConfiguration(anything()));

    component.submitForm();
    verify(punchoutFacade.updateCxmlConfiguration(anything())).once();
  });
});
