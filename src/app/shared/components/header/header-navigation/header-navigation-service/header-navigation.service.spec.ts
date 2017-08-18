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

    it('should return categories data', inject([HeaderNavigationService], (headerNavigationService: HeaderNavigationService) => {
        let categories;
        headerNavigationService.getCategories().map(response => response).subscribe(response => categories = response);
        expect(categories).not.toBeNull();
    }));

    it('should return sub-categories data', inject([HeaderNavigationService], (headerNavigationService: HeaderNavigationService) => {
        let subCategories;
        headerNavigationService.getSubCategories('Cameras-Camcorders').map(response => response).subscribe(response => subCategories = response);
        expect(subCategories).not.toBeNull();
    }));
});
