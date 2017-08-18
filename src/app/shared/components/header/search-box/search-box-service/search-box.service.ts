import { Injectable, Injector, EventEmitter } from '@angular/core'
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { InstanceService } from '../../../../../shared/services/instance.service';
import { SearchBoxApiService } from './search-box.service.api';
import { SearchBoxMockService } from './search-box.service.mock';


export interface ISearchBoxService {
   search(terms: Observable<string>);
};

@Injectable()
export class SearchBoxService implements ISearchBoxService {

    searchBoxservice;

    /**
     * Constructor
     * @param  {InstanceService} privateinstanceService
     */
    constructor(private instanceService: InstanceService) {
        this.searchBoxservice = this.instanceService.getInstance((environment.needMock) ?
            SearchBoxMockService : SearchBoxApiService);
    };

    public search(terms: Observable<string>) {
      return this.searchBoxservice.search(terms);
    }


};
