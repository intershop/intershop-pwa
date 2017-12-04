import { Location } from '@angular/common';
import { async, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';
import { ProductCompareService } from '../../../../core/services/product-compare/product-compare.service';
import { ProductCompareStatusComponent } from './product-compare-status.component';

describe('Product Compare Status Component', () => {
  let fixture;
  let component: ProductCompareStatusComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'compare', component: ProductCompareStatusComponent }
        ]),
        TranslateModule.forRoot()
      ],
      declarations: [
        ProductCompareStatusComponent
      ],
      providers: [
        { provide: ProductCompareService, useFactory: () => instance(mock(ProductCompareService)) }
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(ProductCompareStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();

  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to compare page when compare icon is clicked', async(inject([Router, Location], (router: Router, location: Location) => {
    element.querySelector('a').click();
    fixture.whenStable().then(() => {
      expect(location.path()).toContain('compare');
    });
  })));
});
