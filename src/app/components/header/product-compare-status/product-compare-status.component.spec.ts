import { Location } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';
import { ProductCompareService } from '../../../services/product-compare/product-compare.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { ProductCompareStatusComponent } from './product-compare-status.component';

describe('Product Compare Status Component', () => {
  let fixture;
  let component: ProductCompareStatusComponent;
  let element: HTMLElement;
  let localizeRouterServiceMock: LocalizeRouterService;

  beforeEach(() => {
    localizeRouterServiceMock = mock(LocalizeRouterService);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'compare', redirectTo: 'fakePath' }
        ]),
        TranslateModule.forRoot()
      ],
      declarations: [
        ProductCompareStatusComponent
      ],
      providers: [
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) },
        { provide: ProductCompareService, useFactory: () => instance(mock(ProductCompareService)) }
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
