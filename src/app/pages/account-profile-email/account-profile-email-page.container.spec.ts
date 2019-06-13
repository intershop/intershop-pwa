import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadingComponent } from '../../shared/common/components/loading/loading.component';

import { AccountProfileEmailPageContainerComponent } from './account-profile-email-page.container';
import { AccountProfileEmailPageComponent } from './components/account-profile-email-page/account-profile-email-page.component';

describe('Account Profile Email Page Container', () => {
  let component: AccountProfileEmailPageContainerComponent;
  let fixture: ComponentFixture<AccountProfileEmailPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      declarations: [
        AccountProfileEmailPageContainerComponent,
        MockComponent(AccountProfileEmailPageComponent),
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
