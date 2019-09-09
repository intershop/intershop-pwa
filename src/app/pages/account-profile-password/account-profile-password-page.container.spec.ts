import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';

import { LoadingComponent } from '../../shared/common/components/loading/loading.component';

import { AccountProfilePasswordPageContainerComponent } from './account-profile-password-page.container';
import { AccountProfilePasswordPageComponent } from './components/account-profile-password-page/account-profile-password-page.component';

describe('Account Profile Password Page Container', () => {
  let component: AccountProfilePasswordPageContainerComponent;
  let fixture: ComponentFixture<AccountProfilePasswordPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      declarations: [
        AccountProfilePasswordPageContainerComponent,
        MockComponent(AccountProfilePasswordPageComponent),
        MockComponent(LoadingComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfilePasswordPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
