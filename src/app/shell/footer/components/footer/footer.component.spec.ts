import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { IconModule } from 'ish-core/icon.module';
import { coreReducers } from 'ish-core/store/core-store.module';

import { FooterComponent } from './footer.component';

describe('Footer Component', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let element: HTMLElement;
  let component: FooterComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserTransferStateModule,
        IconModule,
        NgbCollapseModule,
        RouterTestingModule,
        StoreModule.forRoot(coreReducers),
        TranslateModule.forRoot(),
      ],
      declarations: [FooterComponent, ServerHtmlDirective],
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
