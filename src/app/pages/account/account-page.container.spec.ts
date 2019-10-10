import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { BreadcrumbComponent } from 'ish-shared/common/components/breadcrumb/breadcrumb.component';

import { AccountPageContainerComponent } from './account-page.container';
import { AccountNavigationComponent } from './components/account-navigation/account-navigation.component';

describe('Account Page Container', () => {
  let fixture: ComponentFixture<AccountPageContainerComponent>;
  let component: AccountPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountPageContainerComponent,
        MockComponent(AccountNavigationComponent),
        MockComponent(BreadcrumbComponent),
      ],
      imports: [RouterTestingModule],
      providers: [{ provide: AppFacade, useFactory: () => instance(mock(AppFacade)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
