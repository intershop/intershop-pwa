import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfilePasswordPageComponent } from './account-profile-password-page.component';
import { AccountProfilePasswordComponent } from './account-profile-password/account-profile-password.component';

describe('Account Profile Password Page Component', () => {
  let component: AccountProfilePasswordPageComponent;
  let fixture: ComponentFixture<AccountProfilePasswordPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: coreReducers })],
      declarations: [
        AccountProfilePasswordPageComponent,
        MockComponent(AccountProfilePasswordComponent),
        MockComponent(LoadingComponent),
      ],
    }).compileComponents();
  }));

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
