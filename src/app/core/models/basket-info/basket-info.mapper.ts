import { BasketInfo } from './basket-info.model';

export class BasketInfoMapper {
  static fromInfo(payload: { infos: BasketInfo[]; itemId?: string }): BasketInfo[] {
    /**
     * Minor infos or causes, that should not be displayed at the moment.
     * Remove "basket.line_item.add_item_added_to_existing_line_item.info" from the causes array, to redirect the user to the cart after adding the same product to the cart.
     */
    const minorInfos = ['basket.line_item.deletion.info'];
    const minorCauses = ['basket.line_item.add_item_added_to_existing_line_item.info'];

    const { itemId } = payload;
    const infos = payload?.infos
      ?.filter(info => !minorInfos.includes(info.code))
      ?.filter(info => !info.causes.find(cause => minorCauses.includes(cause.code)));

    return itemId
      ? infos?.map(info => ({
          ...info,
          causes: info?.causes?.map(cause => ({ ...cause, parameters: { ...cause.parameters, lineItemId: itemId } })),
        }))
      : infos;
  }
}
