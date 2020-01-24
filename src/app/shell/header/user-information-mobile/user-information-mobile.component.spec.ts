import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';
import { MiniBasketComponent } from 'ish-shell/header/mini-basket/mini-basket.component';
import { ProductCompareStatusComponent } from 'ish-shell/header/product-compare-status/product-compare-status.component';

import { UserInformationMobileComponent } from './user-information-mobile.component';

describe('User Information Mobile Component', () => {
  let component: UserInformationMobileComponent;
  let fixture: ComponentFixture<UserInformationMobileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: { configuration: configurationReducer },
          config: {
            initialState: { configuration: { features: ['compare'] } },
          },
        }),
      ],
      declarations: [
        MockComponent(LanguageSwitchComponent),
        MockComponent(LoginStatusComponent),
        MockComponent(MiniBasketComponent),
        MockComponent(ProductCompareStatusComponent),
        UserInformationMobileComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInformationMobileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
