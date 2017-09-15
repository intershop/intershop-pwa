import { mock, instance, when } from 'ts-mockito';
import { Observable } from 'rxjs/Rx';
import { FilterListService } from './';
import { ApiService } from '../../../services';

describe('FilterListService', () => {
    const apiService: ApiService = mock(ApiService);
    let filterListService: FilterListService;

    beforeEach(() => {
        filterListService = new FilterListService(instance(apiService));
    });

    it('should verify that getSideFilters method is returning the Filters Data', () => {
        const filterData = ['Filter Data1', 'Filter Data1'];
        when(apiService.get('filters/CategoryUUIDLevelMulti;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPXU5Vl9BQUFCTTFBQUFBRmQ0cTBOTHpjdSZPbmxpbmVGbGFnPTE=')).thenReturn(Observable.of(filterData));

        let filterResponse;
        filterListService.getSideFilters().subscribe((data) => {
            filterResponse = data;
        });
        expect(filterResponse).toBe(filterData);
    });
});
