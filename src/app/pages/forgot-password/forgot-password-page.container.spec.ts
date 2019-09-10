import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { LoadingComponent } from '../../shared/common/components/loading/loading.component';

import { ForgotPasswordPageComponent } from './components/forgot-password-page/forgot-password-page.component';
import { ForgotPasswordPageContainerComponent } from './forgot-password-page.container';

describe('Forgot Password Page Container', () => {
  let fixture: ComponentFixture<ForgotPasswordPageContainerComponent>;
  let component: ForgotPasswordPageContainerComponent;
  let element: HTMLElement;
  let storeMock$: Store<{}>;

  beforeEach(async(() => {
    storeMock$ = mock(Store);

    TestBed.configureTestingModule({
      declarations: [
        ForgotPasswordPageContainerComponent,
        MockComponent(ForgotPasswordPageComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: Store, useFactory: () => instance(storeMock$) }],
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
