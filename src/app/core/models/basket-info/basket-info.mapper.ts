import { BasketInfo } from './basket-info.model';

export class BasketInfoMapper {
  static fromInfo(payload: { infos: BasketInfo[]; itemId?: string }): BasketInfo[] {
    const { infos, itemId } = payload;

    return itemId
      ? infos &&
          infos
            .filter(info => info.code !== 'basket.line_item.deletion.info') // deletion is a success and not an info message and won't be displayed so far
            .map(info => ({
              ...info,
              causes:
                info &&
                info.causes &&
                info.causes.map(cause => ({ ...cause, parameters: { ...cause.parameters, lineItemId: itemId } })),
            }))
      : infos;
  }
}
