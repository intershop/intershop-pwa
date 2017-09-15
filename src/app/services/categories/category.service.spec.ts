import { CategoryService } from './category.service';
import { ApiService } from '../';
import { mock, instance, when, anything } from 'ts-mockito';
import { Observable } from 'rxjs/Rx';

describe('Category Service', () => {
    const apiService: ApiService = mock(ApiService);
    let categoryService: CategoryService;

    beforeEach(() => {
        categoryService = new CategoryService(instance(apiService));
    });

    it('should verify that getCategories method is returning the Categories', () => {
        const categoryData = {
            'elements': [
                {
                    'name': 'Mock Cameras',
                    'type': 'Category',
                    'hasOnlineProducts': false,
                    'hasOnlineSubCategories': true,
                    'online': '1',
                    'description': 'The cameras and camcorders products catalog.',
                    'id': 'Cameras-Camcorders',
                    'uri': 'inSPIRED-inTRONICS-Site/-;loc=en_US;cur=USD;/categories/Cameras-Camcorders',
                },
                {
                    'name': 'Fake Computers',
                    'type': 'Category',
                    'hasOnlineProducts': false,
                    'hasOnlineSubCategories': true,
                    'online': '1',
                    'description': 'The Computers products and services catalog.',
                    'id': 'Computers',
                    'uri': 'inSPIRED-inTRONICS-Site/-;loc=en_US;cur=USD;/categories/Computers',

                },
                {
                    'name': 'Home Entertainment',
                    'type': 'Category',
                    'hasOnlineProducts': false,
                    'hasOnlineSubCategories': true,
                    'online': '1',
                    'description': 'The TV & Home Entertainment products and services catalog.',
                    'id': 'Home-Entertainment',
                    'uri': 'inSPIRED-inTRONICS-Site/-;loc=en_US;cur=USD;/categories/Home-Entertainment',

                },
                {
                    'name': 'Specials',
                    'type': 'Category',
                    'hasOnlineProducts': false,
                    'hasOnlineSubCategories': true,
                    'online': '1',
                    'description': 'Special products and services.',
                    'id': 'Specials',
                    'uri': 'inSPIRED-inTRONICS-Site/-;loc=en_US;cur=USD;/categories/Specials',

                }
            ],
            'type': 'Categories'
        };
        when(apiService.get(anything())).thenReturn(Observable.of(categoryData));
        let categories;
        categoryService.getCategories().subscribe((data) => {
            categories = data;
        });
        expect(categories).toBe(categoryData);
    });

    it('should verify that getSubCategories method is returning the Subcategories', () => {
        const subCategoryData = {
            'elements': [],
            'type': 'Categories'
        };
        when(apiService.get('categories/Cameras-Camcorders')).thenReturn(Observable.of(subCategoryData));

        let subCategories;
        categoryService.getSubCategories('Cameras-Camcorders').subscribe((data) => {
            subCategories = data;
        });

        expect(subCategories).toBe(subCategoryData);
    });
});
