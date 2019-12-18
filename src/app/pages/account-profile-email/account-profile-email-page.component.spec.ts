import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfileEmailPageComponent } from './account-profile-email-page.component';
import { AccountProfileEmailComponent } from './account-profile-email/account-profile-email.component';

describe('Account Profile Email Page Component', () => {
  let component: AccountProfileEmailPageComponent;
  let fixture: ComponentFixture<AccountProfileEmailPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: coreReducers })],
      declarations: [
        AccountProfileEmailPageComponent,
        MockComponent(AccountProfileEmailComponent),
        MockComponent(LoadingComponent),
      ],
    }).compileComponents();
  }));

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
