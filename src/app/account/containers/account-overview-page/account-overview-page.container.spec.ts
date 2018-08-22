import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { MockComponent } from '../../../utils/dev/mock.component';

import { AccountOverviewPageContainerComponent } from './account-overview-page.container';

describe('Account Overview Page Container', () => {
  let fixture: ComponentFixture<AccountOverviewPageContainerComponent>;
  let component: AccountOverviewPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOverviewPageContainerComponent,
        MockComponent({
          selector: 'ish-account-overview-page',
          template: 'Account Overview Page Component',
          inputs: ['user', 'orders'],
        }),
        MockComponent({
          selector: 'ish-loading',
          template: 'Loading Component',
        }),
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
    fixture.detectChanges();
    expect(element.querySelector('ish-account-overview-page')).toBeTruthy();
  });
});
