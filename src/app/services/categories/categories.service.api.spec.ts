// import { TestBed, inject } from '@angular/core/testing';
// import { CategoriesApiService } from './categories.service.api';
// import { ApiService } from '../../services/api.service';


// describe('Category Api Service', () => {
//     class ApiServiceStub {
//         get(url) {
//             return url;
//         }
//     }

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [CategoriesApiService,
//                 { provide: ApiService, useClass: ApiServiceStub }
//             ]
//         });
//     });

//     // it('should check if proper url is getting passed in case of getCategories', inject([CategoriesApiService], (categoriesApiService: CategoriesApiService) => {
//     //     const urlPassed = categoriesApiService.getCategories();
//     //     expect(urlPassed).toEqual('categories');
//     // }));

//     // it('should check if proper url is getting passed in case of getSubCategories', inject([CategoriesApiService], (categoriesApiService: CategoriesApiService) => {
//     //     const urlPassed = categoriesApiService.getSubCategories('Cameras');
//     //     expect(urlPassed).toEqual('categories/Cameras');
//     // }));
// });
