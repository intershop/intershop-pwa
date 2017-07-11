import { Injectable, Injector } from '@angular/core'
import { Observable } from "rxjs/Observable";

@Injectable()
export class InstanceService {
    constructor(private inject: Injector) { }
    
    /**
     * returns an instance of the service to be used
     * @param  {any} serviceType
     */
    getInstance(serviceType: any) {
        return this.inject.get(serviceType);
    }
}