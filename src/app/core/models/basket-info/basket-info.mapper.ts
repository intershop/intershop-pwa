import { ErrorFeedback } from 'ish-core/models/http-error/http-error.model';

import { BasketInfo } from './basket-info.model';

export class BasketInfoMapper {
  static fromInfo(payload: { infos: BasketInfo[]; itemId?: string; errors?: ErrorFeedback[] }): BasketInfo[] {
    // minor infos, that should not be displayed at the moment
    const minorInfos = ['basket.line_item.deletion.info'];

    const { itemId } = payload;
    const infos = payload?.infos?.filter(info => !minorInfos.includes(info.code));

    return itemId
      ? infos?.map(info => ({
          ...info,
          causes: info?.causes?.map(cause => ({ ...cause, parameters: { ...cause.parameters, lineItemId: itemId } })),
          error: payload.errors,
        }))
      : infos?.map(info => ({
          ...info,
          error: payload.errors,
        }));
  }
}
