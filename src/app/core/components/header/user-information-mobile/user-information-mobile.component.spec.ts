import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MockComponent } from '../../../../utils/dev/mock.component';

import { UserInformationMobileComponent } from './user-information-mobile.component';

describe('User Information Mobile Component', () => {
  let component: UserInformationMobileComponent;
  let fixture: ComponentFixture<UserInformationMobileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        UserInformationMobileComponent,
        MockComponent({ selector: 'ish-login-status-container', template: 'Login Status Container' }),
        MockComponent({
          selector: 'ish-product-compare-status-container',
          template: 'Product Compare Status Container',
        }),
        MockComponent({ selector: 'ish-language-switch-container', template: 'Language Switch Container' }),

        MockComponent({ selector: 'ish-mini-basket-container', template: 'Mini Basket Container' }),
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
