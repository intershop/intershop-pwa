import { TestBed, inject } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CategoryService } from './category.service';
import { InstanceService } from '../instance.service';
import { CategoryMockService } from './category.service.mock';

describe('Category Service', () => {
    environment.needMock = true;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CategoryMockService, CategoryService, InstanceService]
        });
    });

    it('should verify that getCategories method is returning the Categories', inject([CategoryService], (categoryService: CategoryService) => {
        let categories;
        categoryService.getCategories().map(response => response).subscribe(response => categories = response);
        expect(categories).not.toBeNull();
    }));

    it('should verify that getSubCategories method is returning the Subcategories', inject([CategoryService], (categoryService: CategoryService) => {
        let subCategories;
        categoryService.getSubCategories('Cameras-Camcorders').map(response => response).subscribe(response => subCategories = response);
        expect(subCategories).not.toBeNull();
    }));
});
