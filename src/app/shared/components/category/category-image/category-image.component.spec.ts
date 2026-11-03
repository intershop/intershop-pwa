import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Category } from 'ish-core/models/category/category.model';

import { CategoryImageComponent } from './category-image.component';

describe('Category Image Component', () => {
  let component: CategoryImageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<CategoryImageComponent>;

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

  it('should render image dimensions as width and height attributes to reserve layout space', () => {
    fixture.componentRef.setInput('category', {
      uniqueId: 'A',
      categoryPath: ['A'],
      images: [
        {
          type: 'Image',
          effectiveUrl: '/assets/product_img/a.jpg',
          imageActualWidth: 300,
          imageActualHeight: 200,
          primaryImage: true,
        },
      ],
    } as Category);
    fixture.detectChanges();

    const imgElement = element.querySelector('img');
    expect(imgElement.getAttribute('width')).toBe('300');
    expect(imgElement.getAttribute('height')).toBe('200');
  });

  it('should render square fallback dimensions when the image has no dimensions', () => {
    const imgElement = element.querySelector('img');
    expect(imgElement.getAttribute('src')).toBe('/assets/product_img/a.jpg');
    expect(imgElement.getAttribute('width')).toBe('270');
    expect(imgElement.getAttribute('height')).toBe('270');
  });

  it('should render N/A image with square fallback dimensions when category has no image', () => {
    fixture.componentRef.setInput('category', { uniqueId: 'B', categoryPath: ['B'] } as Category);
    fixture.detectChanges();

    const imgElement = element.querySelector('img');
    expect(imgElement.getAttribute('src')).toBe('/assets/img/not-available.svg');
    expect(imgElement.getAttribute('width')).toBe('270');
    expect(imgElement.getAttribute('height')).toBe('270');
  });
});
