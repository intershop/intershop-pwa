import { Location } from '@angular/common';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ProductCompareStatusComponent } from './product-compare-status.component';

describe('Product Compare Status Component', () => {
  let fixture: ComponentFixture<ProductCompareStatusComponent>;
  let component: ProductCompareStatusComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'compare', component: ProductCompareStatusComponent }]),
        TranslateModule.forRoot(),
      ],
      declarations: [MockComponent(FaIconComponent), ProductCompareStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCompareStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should navigate to compare page when compare icon is clicked', async(
    inject([Location], (location: Location) => {
      fixture.detectChanges();
      element.querySelector('a').click();
      fixture.whenStable().then(() => {
        expect(location.path()).toContain('compare');
      });
    })
  ));
});
