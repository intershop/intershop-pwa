import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { CookiesBannerComponent } from 'ish-shell/application/cookies-banner/cookies-banner.component';

import { AppComponent } from './app.component';
import { CopilotComponent } from './extensions/copilot/copilot.component';
import { FooterComponent } from './shell/footer/footer/footer.component';
import { HeaderComponent } from './shell/header/header/header.component';

let translate: TranslateService;

describe('App Component', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let element: HTMLElement;
  let appFacade: AppFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent(CookiesBannerComponent),
        MockComponent(CopilotComponent),
        MockComponent(FooterComponent),
        MockComponent(HeaderComponent),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    when(appFacade.appWrapperClasses$).thenReturn(of(['col-m-12']));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render header component on page', () => {
    expect(findAllCustomElements(element)).toContain('ish-header');
  });
});
