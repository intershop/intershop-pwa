import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from './components/mock.component';

let translate: TranslateService;

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent({ selector: 'is-header', template: 'Header Component' }),
        MockComponent({ selector: 'is-footer', template: 'Footer Component' })
      ],
      providers: [
        TranslateService
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should be created', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should display the mocked text from Header Component', () => {
    const element = fixture.nativeElement;
    expect(element.querySelector('is-header').textContent).toEqual('Header Component');
  });
});

