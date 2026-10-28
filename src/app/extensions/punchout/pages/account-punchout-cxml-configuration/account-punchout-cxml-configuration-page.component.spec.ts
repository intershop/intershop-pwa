import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { CxmlConfiguration } from '../../models/cxml-configuration/cxml-configuration.model';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

import { AccountPunchoutCxmlConfigurationPageComponent } from './account-punchout-cxml-configuration-page.component';
import { CxmlConfigurationFormComponent } from './cxml-configuration-form/cxml-configuration-form.component';

describe('Account Punchout Cxml Configuration Page Component', () => {
  let component: AccountPunchoutCxmlConfigurationPageComponent;
  let fixture: ComponentFixture<AccountPunchoutCxmlConfigurationPageComponent>;
  let element: HTMLElement;
  let punchoutFacade: PunchoutFacade;

  beforeEach(async () => {
    punchoutFacade = mock(PunchoutFacade);
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [
        AccountPunchoutCxmlConfigurationPageComponent,
        MockComponent(CxmlConfigurationFormComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) }, provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPunchoutCxmlConfigurationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const user = {
      login: '1',
    } as PunchoutUser;
    const cxmlConfiguration = [{ name: 'test', value: 'test value' }] as CxmlConfiguration[];
    when(punchoutFacade.selectedPunchoutUser$).thenReturn(of(user));
    when(punchoutFacade.cxmlConfiguration$()).thenReturn(of(cxmlConfiguration));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the configuration form after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-cxml-configuration-form')).toBeTruthy();
  });

  it('should display a loading overlay if the configuration is loading', () => {
    when(punchoutFacade.cxmlConfigurationLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display an error message if loading the configuration fails', () => {
    when(punchoutFacade.cxmlConfiguration$()).thenReturn(of([]));
    when(punchoutFacade.cxmlConfigurationError$).thenReturn(of(makeHttpError({ message: 'error' })));
    fixture.detectChanges();
    expect(element.querySelector('ish-cxml-configuration-form')).toBeFalsy();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });

  it('should reset the configuration when the page is left', () => {
    fixture.detectChanges();
    fixture.destroy();
    verify(punchoutFacade.resetCxmlConfiguration()).once();
  });
});
