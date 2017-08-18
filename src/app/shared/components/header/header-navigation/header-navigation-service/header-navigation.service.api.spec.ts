import { TestBed, inject } from '@angular/core/testing';
import { HeaderNavigationService } from './header-navigation.service';
import { InstanceService } from '../../../../../shared/services/instance.service';
import { HeaderNavigationApiService } from './header-navigation.service.api';
import { ApiService } from '../../../../../shared/services/api.service';


describe('Header Navigation Api Service', () => {
    class ApiServiceStub {
        get(url) {
            return url;
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HeaderNavigationApiService,
                { provide: ApiService, useClass: ApiServiceStub }
            ]
        });
    });

    it('should check if proper url is getting passed in case of getCategories', inject([HeaderNavigationApiService], (headerNavigationApiService: HeaderNavigationApiService) => {
        const urlPassed = headerNavigationApiService.getCategories();
        expect(urlPassed).toEqual('categories');
    }));

    it('should check if proper url is getting passed in case of getSubCategories', inject([HeaderNavigationApiService], (headerNavigationApiService: HeaderNavigationApiService) => {
        const urlPassed = headerNavigationApiService.getSubCategories('Cameras');
        expect(urlPassed).toEqual('categories/Cameras');
    }));
});
