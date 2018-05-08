import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { findAllIshElements } from '../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../utils/dev/mock.component';
import { ShoppingState } from '../../store/shopping.state';
import { ComparePageContainerComponent } from './compare-page.container';

describe('Compare Page Container', () => {
  let fixture: ComponentFixture<ComparePageContainerComponent>;
  let element: HTMLElement;
  let component: ComparePageContainerComponent;
  let storeMock$: Store<ShoppingState>;

  beforeEach(
    async(() => {
      storeMock$ = mock(Store);
      TestBed.configureTestingModule({
        declarations: [
          ComparePageContainerComponent,
          MockComponent({
            selector: 'ish-product-compare-list',
            template: 'Product Compare List Component',
            inputs: ['compareProducts'],
          }),
        ],
        imports: [TranslateModule.forRoot()],
        providers: [{ provide: Store, useFactory: () => instance(storeMock$) }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageContainerComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display compare product list when no compare products available', () => {
    when(storeMock$.pipe(anything())).thenCall(selector => {
      return selector(
        of({
          shopping: {
            compare: {
              products: [],
            },
          },
        })
      );
    });
    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual([]);
  });

  it('should display compare product list when compare products available', () => {
    when(storeMock$.pipe(anything())).thenCall(selector => {
      return selector(
        of({
          shopping: {
            products: {
              entities: {
                '1': { sku: '1' },
                '2': { sku: '2' },
              },
            },
            compare: {
              products: ['1', '2'],
            },
          },
        })
      );
    });
    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-product-compare-list']);
  });

  it('should dispatch an action if removeProductCompare is called', () => {
    component.removeFromCompare('111');
    verify(storeMock$.dispatch(anything())).called();
  });
});
