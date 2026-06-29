import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutUserFormComponent } from '../../shared/punchout-user-form/punchout-user-form.component';

import { AccountPunchoutCreatePageComponent } from './account-punchout-create-page.component';

describe('Account Punchout Create Page Component', () => {
  let component: AccountPunchoutCreatePageComponent;
  let fixture: ComponentFixture<AccountPunchoutCreatePageComponent>;
  let element: HTMLElement;
  let punchoutFacade: PunchoutFacade;

  beforeEach(async () => {
    punchoutFacade = mock(PunchoutFacade);

    await TestBed.configureTestingModule({
      imports: [AccountPunchoutCreatePageComponent],
      providers: [{ provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) }],
    })
      .overrideComponent(AccountPunchoutCreatePageComponent, {
        remove: { imports: [ErrorMessageComponent, LoadingComponent, PunchoutUserFormComponent] },
        add: {
          imports: [
            MockComponent(ErrorMessageComponent),
            MockComponent(LoadingComponent),
            MockComponent(PunchoutUserFormComponent),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPunchoutCreatePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(punchoutFacade.selectedPunchoutType$).thenReturn(EMPTY);
    when(punchoutFacade.punchoutLoading$).thenReturn(of(true));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
