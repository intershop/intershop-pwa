import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

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
      imports: [TranslateModule.forRoot()],
      declarations: [
        AccountPunchoutCxmlConfigurationPageComponent,
        MockComponent(CxmlConfigurationFormComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) }],
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
});
