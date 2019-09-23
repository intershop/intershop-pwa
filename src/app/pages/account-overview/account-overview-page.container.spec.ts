import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { User } from 'ish-core/models/user/user.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { AccountOverviewPageContainerComponent } from './account-overview-page.container';
import { AccountOverviewPageComponent } from './components/account-overview-page/account-overview-page.component';

describe('Account Overview Page Container', () => {
  let fixture: ComponentFixture<AccountOverviewPageContainerComponent>;
  let component: AccountOverviewPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOverviewPageContainerComponent,
        MockComponent(AccountOverviewPageComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [TranslateModule.forRoot(), ngrxTesting({ reducers: coreReducers })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render account overview component on page', () => {
    const user$ = of({ firstName: 'Patricia' } as User);
    component.user$ = user$;

    fixture.detectChanges();
    expect(element.querySelector('ish-account-overview-page')).toBeTruthy();
  });
});
