import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { LanguageSwitchContainerComponent } from '../../containers/language-switch/language-switch.container';
import { LoginStatusContainerComponent } from '../../containers/login-status/login-status.container';
import { MiniBasketContainerComponent } from '../../containers/mini-basket/mini-basket.container';
import { ProductCompareStatusContainerComponent } from '../../containers/product-compare-status/product-compare-status.container';

import { UserInformationMobileComponent } from './user-information-mobile.component';

describe('User Information Mobile Component', () => {
  let component: UserInformationMobileComponent;
  let fixture: ComponentFixture<UserInformationMobileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(LanguageSwitchContainerComponent),
        MockComponent(LoginStatusContainerComponent),
        MockComponent(MiniBasketContainerComponent),
        MockComponent(ProductCompareStatusContainerComponent),
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
