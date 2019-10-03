import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockPipe } from 'ng-mocks';

import { Category } from 'ish-core/models/category/category.model';
import { CategoryRoutePipe } from 'ish-core/pipes/category-route.pipe';

import { CategoryImageComponent } from '../category-image/category-image.component';

import { CategoryTileComponent } from './category-tile.component';

describe('Category Tile Component', () => {
  let component: CategoryTileComponent;
  let fixture: ComponentFixture<CategoryTileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CategoryTileComponent, MockComponent(CategoryImageComponent), MockPipe(CategoryRoutePipe)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const category = {
      uniqueId: 'A',
      categoryPath: ['A'],
      images: [
        {
          name: 'front S',
          type: 'Image',
          imageActualHeight: 110,
          imageActualWidth: 110,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'S',
          primaryImage: false,
        },
      ],
    } as Category;
    component.category = category;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should always have created image', () => {
    fixture.detectChanges();
    const imgComponentElement = element.querySelector('ish-category-image');
    expect(imgComponentElement).toBeTruthy();
  });
});
