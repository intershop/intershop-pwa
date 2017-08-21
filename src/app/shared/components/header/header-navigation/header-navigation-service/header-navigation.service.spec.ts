import { TestBed, inject } from '@angular/core/testing';
import { environment } from '../../../../../../environments/environment';
import { HeaderNavigationService } from './header-navigation.service';
import { InstanceService } from '../../../../../shared/services/instance.service';
import { HeaderNavigationMockService } from './header-navigation.service.mock';

describe('Header Navigation Service', () => {
    environment.needMock = true;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HeaderNavigationMockService, HeaderNavigationService, InstanceService]
        });
    });

    it('should verify that getCategories method is returning the Categories', inject([HeaderNavigationService], (headerNavigationService: HeaderNavigationService) => {
        let categories;
        headerNavigationService.getCategories().map(response => response).subscribe(response => categories = response);
        expect(categories).not.toBeNull();
    }));

    it('should verify that getSubCategories method is returning the Subcategories', inject([HeaderNavigationService], (headerNavigationService: HeaderNavigationService) => {
        let subCategories;
        headerNavigationService.getSubCategories('Cameras-Camcorders').map(response => response).subscribe(response => subCategories = response);
        expect(subCategories).not.toBeNull();
    }));
});
