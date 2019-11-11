import { BasketInfoMapper } from './basket-info.mapper';
import { BasketInfo } from './basket-info.model';

describe('Basket Info Mapper', () => {
  describe('fromInfo', () => {
    let infoBaseData: { infos: BasketInfo[]; itemId?: string };
    beforeEach(() => {
      infoBaseData = {
        infos: [
          {
            code: 'basket.line_item.creation.info',
            message: 'infoMessage',
            causes: [
              {
                code: 'basket.line_item.add_item_added_to_new_line_item_with_adjusted_quantity.info',
                message: 'infoMessage1',
              },
            ],
          } as BasketInfo,
        ],
      };
    });

    it(`should return Basket Info when getting Basket Info Data`, () => {
      const basketInfo = BasketInfoMapper.fromInfo(infoBaseData);
      expect(basketInfo).toBeTruthy();
      expect(basketInfo[0].message).toEqual('infoMessage');
      expect(basketInfo[0].causes[0].message).toEqual('infoMessage1');
    });

    it('should return Basket Info with lineItemId when getting a lineItemId', () => {
      infoBaseData = { ...infoBaseData, itemId: 'xyz' };

      const basketInfo = BasketInfoMapper.fromInfo(infoBaseData);
      expect(basketInfo).toBeTruthy();
      expect(basketInfo[0].message).toEqual('infoMessage');
      expect(basketInfo[0].causes[0].message).toEqual('infoMessage1');
      expect(basketInfo[0].causes[0].parameters.lineItemId).toEqual('xyz');
    });
  });
});
