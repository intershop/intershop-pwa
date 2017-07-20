// import { TestBed, async } from '@angular/core/testing';
// import { Component, Directive, Injectable, Input } from '@angular/core';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { AppComponent } from './app.component';
// import { TranslateService } from "@ngx-translate/core";
// import { FooterComponent } from "./shared/components/footer/footer.component";

// var translate: TranslateService;

// describe('AppComponent', () => {
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         AppComponent, HeaderStubComponent, FooterComponent, RouterOutletStubComponent
//       ],
//       providers: [
//         TranslateService
//       ],
//       imports: [
//         TranslateModule.forRoot()
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     translate = TestBed.get(TranslateService);
//     translate.setDefaultLang('en');
//     // the lang to use, if the lang isn't available, it will use the current loader to get them
//     translate.use('en');
//   })

//   it('should create the app', async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   }));

//   it(`should have as title 'app'`, async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app.title).toEqual('app');
//   }));

//   /* it('should render title in a h1 tag', async(() => {
//      const fixture = TestBed.createComponent(AppComponent);
//      fixture.detectChanges();
//      const compiled = fixture.debugElement.nativeElement;
//      expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!!');
//    }));*/
// });


// @Component({ selector: 'router-outlet', template: '' })
// export class RouterOutletStubComponent { }

// @Component({ selector: 'is-header', template: '' })
// export class HeaderStubComponent { }
//TODO: commented as causing issue for server side rendering