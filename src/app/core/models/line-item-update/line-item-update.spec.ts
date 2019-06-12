import { LineItemUpdateHelper } from './line-item-update.helper';

describe('Line Item Update', () => {
  it('should have deepest level navigateable on tree', () => {
    const updates = [
      // should update because quantity
      {
        itemId: 'testItemId',
        quantity: 2,
        sku: 'SKU',
      },
      // should update because sku
      {
        itemId: 'testItemId',
        quantity: 1,
        sku: 'SKU2',
      },
      // should not update because same sku || quantity
      {
        itemId: 'testItemId',
        quantity: 1,
        sku: 'SKU',
      },
    ];

    const items = [
      {
        id: 'testItemId',
        productSKU: 'SKU',
        quantity: {
          value: 1,
        },
      },
    ];

    const filteredUpdates = LineItemUpdateHelper.filterUpdatesByItems(updates, items);

    expect(filteredUpdates).toEqual(updates.slice(0, 2));
    expect(filteredUpdates).not.toEqual(updates.slice(2, 1));
  });
});
