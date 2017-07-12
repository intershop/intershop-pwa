
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { Data } from "app/shared/components/categoryList/categoryList.mock";
import { ICategoryService } from "app/shared/components/categoryList/categoryListService/categoryList.service";

@Injectable()
export class CategoryMockService implements ICategoryService {
    
    /**
     * @returns List of categories as an Observable
     */
    getSideFilters(): Observable<any> {
        return Observable.of(Data);
    }

}





