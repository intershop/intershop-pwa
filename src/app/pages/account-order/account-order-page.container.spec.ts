import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { coreReducers } from 'ish-core/store/core-store.module';
import { MockComponent } from '../../utils/dev/mock.component';

import { AccountOrderPageContainerComponent } from './account-order-page.container';

describe('Account Order Page Container', () => {
  let component: AccountOrderPageContainerComponent;
  let fixture: ComponentFixture<AccountOrderPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...coreReducers,
        }),
      ],
      declarations: [
        AccountOrderPageContainerComponent,
        MockComponent({
          selector: 'ish-account-order-page',
          template: 'Account Order Detail Page Component',
          inputs: ['order'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
