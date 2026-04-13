import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfilePasswordPageComponent } from './account-profile-password-page.component';
import { AccountProfilePasswordComponent } from './account-profile-password/account-profile-password.component';

describe('Account Profile Password Page Component', () => {
  let component: AccountProfilePasswordPageComponent;
  let fixture: ComponentFixture<AccountProfilePasswordPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountProfilePasswordPageComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    })
      .overrideComponent(AccountProfilePasswordPageComponent, {
        set: {
          imports: [MockComponent(AccountProfilePasswordComponent), AsyncPipe, MockComponent(LoadingComponent)],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfilePasswordPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
