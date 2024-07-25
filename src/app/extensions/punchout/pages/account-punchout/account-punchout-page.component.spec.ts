import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

import { AccountPunchoutHeaderComponent } from './account-punchout-header/account-punchout-header.component';
import { AccountPunchoutPageComponent } from './account-punchout-page.component';

describe('Account Punchout Page Component', () => {
  let component: AccountPunchoutPageComponent;
  let fixture: ComponentFixture<AccountPunchoutPageComponent>;
  let element: HTMLElement;
  let punchoutFacade: PunchoutFacade;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;

  const users = [
    { login: 'punchout1@test.intershop.de', email: 'punchout1@test.intershop.de' },
    { login: 'punchout2@test.intershop.de', email: 'punchout2@test.intershop.de' },
  ] as PunchoutUser[];

  beforeEach(async () => {
    punchoutFacade = mock(PunchoutFacade);
    accountFacade = mock(AccountFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountPunchoutPageComponent,
        MockComponent(AccountPunchoutHeaderComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
        MockPipe(ServerSettingPipe, path => path === 'punchout.cxmlUserConfigurationEnabled'),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPunchoutPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(punchoutFacade.punchoutUsersByRoute$()).thenReturn(of(users));
    when(punchoutFacade.selectedPunchoutType$).thenReturn(of('oci'));
    when(appFacade.getRestEndpoint$).thenReturn(of('https://myBaseServerURL/INTERSHOP/rest/WFS/myChannel/rest'));
    when(appFacade.getPipelineEndpoint$).thenReturn(
      of('https://myBaseServerURL/INTERSHOP/web/WFS/myChannel/en_US/rest/USD')
    );
    when(punchoutFacade.punchoutLoading$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading overlay if users are loading', () => {
    when(punchoutFacade.punchoutLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display user list after creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="user-list"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="user-list"]').innerHTML).toContain('punchout1@test.intershop.de');

    expect(element.querySelector('[data-testing-id="empty-user-list"]')).toBeFalsy();
  });

  it('should call deletePunchoutUser at punchout facade  when deleteUser is triggered', () => {
    when(punchoutFacade.deletePunchoutUser(anyString())).thenReturn(undefined);

    component.deleteUser(users[0]);

    verify(punchoutFacade.deletePunchoutUser(users[0])).once();
  });

  it('should display the empty list message if there is no user', () => {
    when(punchoutFacade.punchoutUsersByRoute$()).thenReturn(of([]));

    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="empty-user-list"]')).toBeTruthy();
  });

  it('should determine cxml punchout url on init', done => {
    when(accountFacade.customer$).thenReturn(of({ customerNo: 'OilCorp' } as Customer));

    fixture.detectChanges();

    component.cxmlPunchoutUrl$.subscribe(url => {
      expect(url).toMatchInlineSnapshot(
        `"https://myBaseServerURL/INTERSHOP/rest/WFS/myChannel/rest/customers/OilCorp/punchouts/cxml1.2/setuprequest"`
      );
      done();
    });
  });

  it('should determine oci punchout url on init', done => {
    fixture.detectChanges();

    component.ociPunchoutUrl$.subscribe(url => {
      expect(url).toMatchInlineSnapshot(
        `"https://myBaseServerURL/INTERSHOP/web/WFS/myChannel/en_US/rest/USD/ViewOCICatalogPWA-Start?USERNAME=<USERNAME>&PASSWORD=<PASSWORD>&HOOK_URL=<HOOK_URL>"`
      );
      done();
    });
  });
});
