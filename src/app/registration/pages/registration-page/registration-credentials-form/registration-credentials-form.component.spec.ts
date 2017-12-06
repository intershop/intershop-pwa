import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { instance, mock, when } from 'ts-mockito';
import { GlobalConfiguration } from '../../../../core/configurations/global.configuration';
import { SharedModule } from '../../../../shared/shared.module';
import { RegistrationCredentialsFormComponent } from './registration-credentials-form.component';

describe('Credentials Form Component', () => {
  let component: RegistrationCredentialsFormComponent;
  let fixture: ComponentFixture<RegistrationCredentialsFormComponent>;
  let globalConfigurationMock: GlobalConfiguration;
  let element: HTMLElement;

  const accountSettings = {
    emailOptIn: true
  };

  beforeEach(async(() => {
    globalConfigurationMock = mock(GlobalConfiguration);

    when(globalConfigurationMock.getApplicationSettings()).thenReturn(accountSettings);

    TestBed.configureTestingModule({
      declarations: [RegistrationCredentialsFormComponent],
      imports: [
        SharedModule
      ],
      providers: [
        { provide: GlobalConfiguration, useFactory: () => instance(globalConfigurationMock) },
        { provide: TranslateService }

      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(RegistrationCredentialsFormComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });
});
