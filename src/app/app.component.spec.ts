import { TestBed, async } from '@angular/core/testing';
import { Component, Directive, Injectable, Input } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { FooterComponent } from './shared/components/footer/footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from './shared/components/mock.component';


let translate: TranslateService;

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, FooterComponent, MockComponent({ selector: 'is-header', template: 'Header Component' }),
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
  })

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should match the text passed in Header Component', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('is-header').textContent).toEqual('Header Component')
  }));
});

