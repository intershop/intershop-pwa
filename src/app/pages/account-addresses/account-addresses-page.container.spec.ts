import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { PipesModule } from 'ish-core/pipes.module';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { AccountAddressesPageContainerComponent } from './account-addresses-page.container';
import { AccountAddressesPageComponent } from './components/account-addresses-page/account-addresses-page.component';

describe('Account Addresses Page Container', () => {
  let component: AccountAddressesPageContainerComponent;
  let fixture: ComponentFixture<AccountAddressesPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountAddressesPageContainerComponent,
        MockComponent(AccountAddressesPageComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [PipesModule],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAddressesPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render account addresses component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-account-addresses-page')).toBeTruthy();
  });
});
