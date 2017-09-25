import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock, when } from 'ts-mockito';
import { ProductCompareService } from '../services/product-compare/product-compare.service';
import { DisableIconDirective } from './disable-icon.directive';

describe('DisableIconDirective', () => {
  @Component({
    template: `<div class="is-selected" isDisableIcon [property]="'123'" [globalStateKey]="'productCompareData'">MockComponent</div>`
  })
  class MockComponent {
    @ViewChild(DisableIconDirective) disableIconDirective: DisableIconDirective = null;
  }

  let fixture: ComponentFixture<MockComponent>;
  let component: MockComponent;
  let element: HTMLElement;
  let productCompareServiceMock: ProductCompareService;
  class ElementRefStub {

  }
  class RendererStub {

  }

  beforeEach(async(() => {
    productCompareServiceMock = mock(ProductCompareService);
    when(productCompareServiceMock.current).thenReturn([]);

    TestBed.configureTestingModule({
      declarations: [DisableIconDirective, MockComponent],
      providers: [{ provide: ElementRef, useClass: ElementRefStub },
      { provide: Renderer2, useClass: RendererStub },
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
    when(productCompareServiceMock.current).thenReturn(['123']);
    const div = fixture.nativeElement.firstElementChild;
    fixture.detectChanges();
    expect(div.className).toBe('is-selected');
  });
});


