import { TestBed, inject } from '@angular/core/testing';
import { CategoryApiService } from './category.service.api';
import { ApiService } from '../../services/api.service';

describe('Category Api Service', () => {
    class ApiServiceStub {
        get(url) {
            return url;
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CategoryApiService,
                { provide: ApiService, useClass: ApiServiceStub }
            ]
        });
    });

    it('should check if proper url is getting passed in case of getCategories', inject([CategoryApiService], (categoryApiService: CategoryApiService) => {
        const urlPassed = categoryApiService.getCategories();
        expect(urlPassed).toEqual('categories');
    }));

    it('should check if proper url is getting passed in case of getSubCategories', inject([CategoryApiService], (categoryApiService: CategoryApiService) => {
        const urlPassed = categoryApiService.getSubCategories('Cameras');
        expect(urlPassed).toEqual('categories/Cameras');
    }));
});
