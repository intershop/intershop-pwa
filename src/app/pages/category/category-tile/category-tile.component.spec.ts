import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { CategoryRoutePipe } from 'ish-core/routing/category/category-route.pipe';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { CategoryImageComponent } from '../category-image/category-image.component';

import { CategoryTileComponent } from './category-tile.component';

describe('Category Tile Component', () => {
  let component: CategoryTileComponent;
  let fixture: ComponentFixture<CategoryTileComponent>;
  let element: HTMLElement;

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

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.category$(anything())).thenReturn(
      of(createCategoryView(categoryTree([category]), category.uniqueId))
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CategoryTileComponent, MockComponent(CategoryImageComponent), MockPipe(CategoryRoutePipe)],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
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
