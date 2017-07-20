import {Injectable, Injector} from '@angular/core'

@Injectable()
export class InstanceService {
  
  /**
   * Constructor
   * @param  {Injector} privateinject
   */
  constructor(private inject: Injector) {
  }

  /**
   * Returns an instance of the service to be used
   * @param  {any} serviceType
   */
  getInstance(serviceType: any) {
    return this.inject.get(serviceType);
  }
}
