import { TestBed, async, inject } from '@angular/core/testing';
import { ProductListService } from './products.service';
import { InstanceService } from '../../services';
import { ProductListMockService } from '../../services/products/products.service.mock';

describe('ProuctList Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProductListService, InstanceService, ProductListMockService
            ]
        });
    });

    it('should call getProductList method', async(inject([ProductListService], (productListService: ProductListService) => {
        const data = productListService.getProductList();
        expect(data).not.toBe(null);
    })));
});
