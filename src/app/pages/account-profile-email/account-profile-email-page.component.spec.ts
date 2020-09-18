import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfileEmailPageComponent } from './account-profile-email-page.component';
import { AccountProfileEmailComponent } from './account-profile-email/account-profile-email.component';

describe('Account Profile Email Page Component', () => {
  let component: AccountProfileEmailPageComponent;
  let fixture: ComponentFixture<AccountProfileEmailPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountProfileEmailPageComponent,
        MockComponent(AccountProfileEmailComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileEmailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
