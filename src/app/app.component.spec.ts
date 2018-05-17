import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { AppComponent } from './app.component';
import { MockComponent } from './utils/dev/mock.component';

let translate: TranslateService;

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent({ selector: 'ish-header-container', template: 'Header Component' }),
        MockComponent({ selector: 'ish-footer', template: 'Footer Component' }),
      ],
      providers: [TranslateService, { provide: Store, useFactory: () => instance(mock(Store)) }],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render header component on page', async(() => {
    expect(element.querySelector('ish-header-container').textContent).toEqual('Header Component');
  }));
});
