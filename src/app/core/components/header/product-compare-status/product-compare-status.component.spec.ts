import { Location } from '@angular/common';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../../../icon.module';
import { ProductCompareStatusComponent } from './product-compare-status.component';

describe('Product Compare Status Component', () => {
  let fixture;
  let component: ProductCompareStatusComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'compare', component: ProductCompareStatusComponent }]),
        TranslateModule.forRoot(),
        IconModule,
      ],
      declarations: [ProductCompareStatusComponent],
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
