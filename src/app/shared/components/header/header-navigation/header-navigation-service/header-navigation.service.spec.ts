import { HeaderNavigationService } from './header-navigation.service';
import { TestBed, inject } from '@angular/core/testing';

describe('Header Navigation Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HeaderNavigationService]
        });
    });

    it('should return categories data', inject([HeaderNavigationService], (headerNavigationService: HeaderNavigationService) => {
        let categories;
        headerNavigationService.getCategories().map(response => response).subscribe(response => categories = response);
        expect(categories).not.toBeNull();
    }));

    it('should return sub-categories data', inject([HeaderNavigationService], (headerNavigationService: HeaderNavigationService) => {
        let subCategories;
        headerNavigationService.getSubCategories().map(response => response).subscribe(response => subCategories = response);
        expect(subCategories).not.toBeNull();
    }));
});
