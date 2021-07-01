import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickorderAddProductsFormComponent } from './quickorder-add-products-form.component';

describe('Quickorder Add Products Form Component', () => {
  let component: QuickorderAddProductsFormComponent;
  let fixture: ComponentFixture<QuickorderAddProductsFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickorderAddProductsFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderAddProductsFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
