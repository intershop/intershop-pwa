import { DataRequestData } from './data-request.interface';
import { DataRequestConfirmation } from './data-request.model';

export class DataRequestMapper {
  /**
   * Map data request data to data request confirmation information
   */
  static fromData(data: DataRequestData): DataRequestConfirmation {
    return {
      infoCode: data?.infos[0]?.causes[0]?.code,
    };
  }
}
