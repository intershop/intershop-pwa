import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Category } from 'ish-core/models/category/category.model';

import { CategoryImageComponent } from './category-image.component';

describe('Category Image Component', () => {
  let component: CategoryImageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<CategoryImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryImageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const category = {
      uniqueId: 'A',
      categoryPath: ['A'],
      images: [
        {
          type: 'Image',
          effectiveUrl: '/assets/product_img/a.jpg',
          primaryImage: false,
        },
      ],
    } as Category;
    component.category = category;
    component.showImage = true;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    const imgElement = element.querySelector('img');
    expect(imgElement.getAttribute('src')).toBe('/assets/product_img/a.jpg');
  });
});
