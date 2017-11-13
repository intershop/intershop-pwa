import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';
import { AppComponent } from './app.component';
import { MockComponent } from './components/mock.component';
import { LocalizeRouterService } from './services/routes-parser-locale-currency/localize-router.service';

let translate: TranslateService;

describe('AppComponent', () => {
  let localizeRouterServiceMock: LocalizeRouterService;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent({ selector: 'is-header', template: 'Header Component' }),
        MockComponent({ selector: 'is-footer', template: 'Footer Component' })
      ],
      providers: [
        TranslateService,
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) }
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    localizeRouterServiceMock = mock(LocalizeRouterService);
    translate = TestBed.get(TranslateService);
    fixture = TestBed.createComponent(AppComponent);

    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  });

  it('should be created', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should check if header component is getting rendered properly', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('is-header').textContent).toEqual('Header Component');
  }));
});

