import { ProductCompareStatusComponent } from './product-compare-status.component';
import { Component } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalState } from '../../../services/global.state';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { mock, instance } from 'ts-mockito';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

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
