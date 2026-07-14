import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { OrderTemplate } from '../models/order-template/order-template.model';
import { getAllOrderTemplates, orderTemplatesActions } from '../store/order-template';

import { OrderTemplatesFacade } from './order-templates.facade';

describe('Order Templates Facade', () => {
  let facade: OrderTemplatesFacade;
  let store: MockStore;

  const loadedTemplate: OrderTemplate = {
    id: 'loaded',
    title: 'loaded order template',
    itemsCount: 1,
    items: [{ sku: 'sku1', id: 'item1', creationDate: 1, desiredQuantity: { value: 1 } }],
  };
  const headerTemplate = (id: string): OrderTemplate => ({ id, title: `header order template ${id}`, itemsCount: 2 });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    facade = TestBed.inject(OrderTemplatesFacade);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('orderTemplatesWithDetails$', () => {
    it('should emit all order templates when no count is given', done => {
      store.overrideSelector(getAllOrderTemplates, [loadedTemplate, headerTemplate('a'), headerTemplate('b')]);
      facade.orderTemplatesWithDetails$().subscribe(orderTemplates => {
        expect(orderTemplates.map(orderTemplate => orderTemplate.id)).toEqual(['loaded', 'a', 'b']);
        done();
      });
    });

    it('should emit only the first `count` order templates', done => {
      store.overrideSelector(getAllOrderTemplates, [
        headerTemplate('a'),
        headerTemplate('b'),
        headerTemplate('c'),
        headerTemplate('d'),
      ]);
      facade.orderTemplatesWithDetails$(2).subscribe(orderTemplates => {
        expect(orderTemplates.map(orderTemplate => orderTemplate.id)).toEqual(['a', 'b']);
        done();
      });
    });

    it('should trigger loading the details of emitted templates without loaded items', done => {
      store.overrideSelector(getAllOrderTemplates, [loadedTemplate, headerTemplate('a'), headerTemplate('b')]);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.orderTemplatesWithDetails$(2).subscribe(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          orderTemplatesActions.loadOrderTemplateDetails({ orderTemplateId: 'a' })
        );
        expect(dispatchSpy).not.toHaveBeenCalledWith(
          orderTemplatesActions.loadOrderTemplateDetails({ orderTemplateId: 'b' })
        );
        done();
      });
    });

    it('should not trigger loading when the details of all emitted templates are loaded', done => {
      store.overrideSelector(getAllOrderTemplates, [loadedTemplate]);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.orderTemplatesWithDetails$().subscribe(() => {
        expect(dispatchSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
