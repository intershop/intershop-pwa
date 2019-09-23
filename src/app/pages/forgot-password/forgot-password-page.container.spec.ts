import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { ForgotPasswordPageComponent } from './components/forgot-password-page/forgot-password-page.component';
import { ForgotPasswordPageContainerComponent } from './forgot-password-page.container';

describe('Forgot Password Page Container', () => {
  let fixture: ComponentFixture<ForgotPasswordPageContainerComponent>;
  let component: ForgotPasswordPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ForgotPasswordPageContainerComponent,
        MockComponent(ForgotPasswordPageComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [ngrxTesting({ reducers: coreReducers })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render forgot-password form on Forgot-Password page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-forgot-password-page')).toBeTruthy();
  });
});
