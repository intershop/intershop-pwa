import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock } from 'ts-mockito';

import { User } from 'ish-core/models/user/user.model';

import { LoadingComponent } from '../../shared/common/components/loading/loading.component';

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
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
      imports: [TranslateModule.forRoot()],
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
