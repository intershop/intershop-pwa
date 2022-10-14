import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';

import { RegistrationApprovalComponent } from './registration-approval.component';

describe('Registration Approval Component', () => {
  let fixture: ComponentFixture<RegistrationApprovalComponent>;
  let component: RegistrationApprovalComponent;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockDirective(ServerHtmlDirective), RegistrationApprovalComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();

    when(accountFacade.getCustomerApprovalEmail$).thenReturn(of('test@intershop.de'));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationApprovalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
