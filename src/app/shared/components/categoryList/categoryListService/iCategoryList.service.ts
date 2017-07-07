import {Observable} from 'rxjs/Rx'

export interface ICategoryService{
    getSideFilters() : Observable<any>;
}