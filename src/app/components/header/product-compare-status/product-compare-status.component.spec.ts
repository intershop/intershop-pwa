import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';
import { GlobalState } from '../../../services/global.state';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { ProductCompareStatusComponent } from './product-compare-status.component';

@Component({
  template: ''
})
class DummyComponent {
}

describe('Product Compare Status Component', () => {
  let fixture;
  let component: ProductCompareStatusComponent;
  let element: HTMLElement;
  let localizeRouterServiceMock: LocalizeRouterService;

  beforeEach(() => {
    class GlobalStateStub {
      subscribeCachedData(key, callBack: Function) {
      }
    }

    localizeRouterServiceMock = mock(LocalizeRouterService);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'compare', component: DummyComponent }
        ]),
        TranslateModule.forRoot()
      ],
      declarations: [
        ProductCompareStatusComponent,
        DummyComponent
      ],
      providers: [
        {provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) },
        { provide: GlobalState, useClass: GlobalStateStub }
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(ProductCompareStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should go to URL "compare"', inject([Router, Location], (router: Router, location: Location) => {
    element.querySelector('a').click();
    fixture.whenStable().then(() => {
      expect(location.path()).toContain('compare');
    });
  }));
});
