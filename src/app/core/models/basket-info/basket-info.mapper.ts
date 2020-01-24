import { BasketInfo } from './basket-info.model';

export class BasketInfoMapper {
  static fromInfo(payload: { infos: BasketInfo[]; itemId?: string }): BasketInfo[] {
    // minor infos, that should not be displayed at the moment
    const minorInfos = ['basket.line_item.deletion.info'];

    const { itemId } = payload;
    const infos = payload && payload.infos && payload.infos.filter(info => !minorInfos.includes(info.code));

    return itemId
      ? infos &&
          infos.map(info => ({
            ...info,
            causes:
              info &&
              info.causes &&
              info.causes.map(cause => ({ ...cause, parameters: { ...cause.parameters, lineItemId: itemId } })),
          }))
      : infos;
  }
}
