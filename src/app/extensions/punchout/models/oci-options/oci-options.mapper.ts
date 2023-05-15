import { OciOptionsData } from './oci-options.interface';
import { OciOptions } from './oci-options.model';

export class OciOptionsMapper {
  static fromData(payload: OciOptionsData): OciOptions {
    const { availableFormatters, availablePlaceholders } = payload;

    return {
      availableFormatters: availableFormatters?.map(formatter => formatter.id),
      availablePlaceholders: availablePlaceholders.map(placeholder => placeholder.id),
    };
  }
}
