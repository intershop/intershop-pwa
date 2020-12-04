import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SpaCheckoutSinglePageComponent } from './spa-checkout-single-page.component';

describe('Spa Checkout Single Page Component', () => {
  let component: SpaCheckoutSinglePageComponent;
  let fixture: ComponentFixture<SpaCheckoutSinglePageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpaCheckoutSinglePageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutSinglePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
