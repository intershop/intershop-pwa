import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfileUserPageComponent } from './account-profile-user-page.component';
import { AccountProfileUserComponent } from './account-profile-user/account-profile-user.component';

describe('Account Profile User Page Component', () => {
  let component: AccountProfileUserPageComponent;
  let fixture: ComponentFixture<AccountProfileUserPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const appFacade = mock(AppFacade);
    when(appFacade.currentLocale$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [
        AccountProfileUserPageComponent,
        MockComponent(AccountProfileUserComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileUserPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
