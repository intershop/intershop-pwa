import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { Category } from 'ish-core/models/category/category.model';
import { ICM_BASE_URL } from 'ish-core/utils/state-transfer/factories';

import { CategoryImageComponent } from './category-image.component';

describe('Category Image Component', () => {
  let component: CategoryImageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<CategoryImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryImageComponent],
      providers: [{ provide: ICM_BASE_URL, useValue: 'http://www.example.org' }],
    }).compileComponents();
  }));

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
    expect(imgElement.getAttribute('src')).toBe('http://www.example.org/assets/product_img/a.jpg');
  });
});
