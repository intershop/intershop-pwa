import { Observable } from 'rxjs/Rx';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../api.service';
import { CategoriesService } from './categories.service';

describe('Categories Service', () => {
  const apiService: ApiService = mock(ApiService);
  let categoriesService: CategoriesService;
  const categoriesData = {
    'elements': [
      {
        'name': 'Cameras',
        'id': 'Cameras-Camcorders',
        'subCategories': [
          {
            'name': 'Lenses',
            'id': '1290',
            'uri': 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders/1290',
            'subCategories': [
              {
                'name': 'Covers',
                'id': '832',
                'uri': 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders/1290/832'
              }
            ]
          }
        ],
        'uri': 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders'
      }
    ]
  };

  beforeEach(() => {
    categoriesService = new CategoriesService(instance(apiService));
  });

  it('should get top level categories when called', () => {
    categoriesService.getTopLevelCategories(0);
    verify(apiService.get(anything(), anything(), anything(), anything())).once();
  });

  // tslint:disable:meaningful-naming-in-tests TODO: enable once ISREST-19 is merged
  it('should verify getFriendlyPathOfCurrentCategory method returns categoryNamesArray containing names of the categories instead of their IDs', () => {
    when(apiService.get(anything(), anything(), anything(), anything())).thenReturn(Observable.of(categoriesData.elements));
    let categoryNamesArray;
    categoriesService.getFriendlyPathOfCurrentCategory('Cameras-Camcorders/1290/832').subscribe(data => {
      categoryNamesArray = data;
    });
    expect(categoryNamesArray).toEqual(['Cameras', 'Lenses', 'Covers']);
  });
});



