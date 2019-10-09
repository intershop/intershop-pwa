import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { AccountProfileEmailPageContainerComponent } from './account-profile-email-page.container';
import { AccountProfileEmailComponent } from './components/account-profile-email/account-profile-email.component';

describe('Account Profile Email Page Container', () => {
  let component: AccountProfileEmailPageContainerComponent;
  let fixture: ComponentFixture<AccountProfileEmailPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: coreReducers })],
      declarations: [
        AccountProfileEmailPageContainerComponent,
        MockComponent(AccountProfileEmailComponent),
        MockComponent(LoadingComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileEmailPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
