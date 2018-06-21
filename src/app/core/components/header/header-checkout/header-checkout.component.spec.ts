import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockComponent } from '../../../../utils/dev/mock.component';
import { HeaderCheckoutComponent } from './header-checkout.component';

describe('Header Checkout Component', () => {
  let component: HeaderCheckoutComponent;
  let fixture: ComponentFixture<HeaderCheckoutComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderCheckoutComponent,
        MockComponent({
          selector: 'ish-login-status-container',
          template: 'Login Status Container',
          inputs: ['logoutOnly'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCheckoutComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login status container for logout link', () => {
    expect(element.getElementsByTagName('ish-login-status-container')[0].textContent).toContain(
      'Login Status Container'
    );
  });

  it('should render home link for navigation to home page', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id=link-home]')).toBeTruthy();
  });
});
