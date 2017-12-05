import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock, when } from 'ts-mockito';
import { ProductCompareService } from '../../core/services/product-compare/product-compare.service';
import { DisableIconDirective } from './disable-icon.directive';

describe('DisableIconDirective', () => {
  @Component({
    template: `<div class="is-selected" isDisableIcon [property]="'123'" [globalStateKey]="'productCompareData'">MockComponent</div>`
  })

  // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
  class MockComponent {
    @ViewChild(DisableIconDirective) disableIconDirective: DisableIconDirective = null;
  }

  let fixture: ComponentFixture<MockComponent>;
  let component: MockComponent;
  let element: HTMLElement;
  let productCompareServiceMock: ProductCompareService;
  const elementRefMock: ElementRef = mock(ElementRef);
  const rendererMock: Renderer2 = mock(Renderer2);

  beforeEach(async(() => {
    productCompareServiceMock = mock(ProductCompareService);
    when(productCompareServiceMock.value).thenReturn([]);

    TestBed.configureTestingModule({
      declarations: [DisableIconDirective, MockComponent],
      providers: [{ provide: ElementRef, useFactory: () => instance(elementRefMock) },
      { provide: Renderer2, useFactory: () => instance(rendererMock) },
      { provide: ProductCompareService, useFactory: () => instance(productCompareServiceMock) }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(MockComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  it('should not add is-selected class when current element not in list', () => {
    const div = fixture.nativeElement.firstElementChild;
    fixture.detectChanges();
    expect(div.className).toBe('');
  });

  it('should add is-selected class when current element in list', () => {
    when(productCompareServiceMock.value).thenReturn(['123']);
    const div = fixture.nativeElement.firstElementChild;
    fixture.detectChanges();
    expect(div.className).toBe('is-selected');
  });
});


