import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { FooterComponent } from './footer.component';

describe('Footer Component', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let element: HTMLElement;
  let component: FooterComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserTransferStateModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({ reducers: coreReducers }),
      ],
      declarations: [FooterComponent, MockComponent(FaIconComponent), MockDirective(ServerHtmlDirective)],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
