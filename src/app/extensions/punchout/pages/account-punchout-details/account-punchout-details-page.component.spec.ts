import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutUserFormComponent } from '../../shared/punchout-user-form/punchout-user-form.component';

import { AccountPunchoutDetailsPageComponent } from './account-punchout-details-page.component';

describe('Account Punchout Details Page Component', () => {
  let component: AccountPunchoutDetailsPageComponent;
  let fixture: ComponentFixture<AccountPunchoutDetailsPageComponent>;
  let element: HTMLElement;
  let punchoutFacade: PunchoutFacade;

  beforeEach(async () => {
    punchoutFacade = mock(PunchoutFacade);
    const user = {
      login: '1',
    } as PunchoutUser;
    when(punchoutFacade.selectedPunchoutUser$).thenReturn(of(user));
    when(punchoutFacade.updatePunchoutUser(anything())).thenReturn();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        AccountPunchoutDetailsPageComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockComponent(PunchoutUserFormComponent),
      ],
      providers: [{ provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPunchoutDetailsPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should submit a valid form when the user fills all required fields', () => {
    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm();

    expect(component.formDisabled).toBeFalse();
  });
});
