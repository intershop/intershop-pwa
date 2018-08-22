import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { spy, verify } from 'ts-mockito';

import { IconModule } from '../../../core/icon.module';

import { ProductAddToQuoteComponent } from './product-add-to-quote.component';

describe('Product Add To Quote Component', () => {
  let component: ProductAddToQuoteComponent;
  let fixture: ComponentFixture<ProductAddToQuoteComponent>;
  let translate: TranslateService;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), IconModule],
      declarations: [ProductAddToQuoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteComponent);
    component = fixture.componentInstance;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show button when display type is not icon ', () => {
    fixture.detectChanges();
    expect(element.querySelector('button').className).toContain('btn-secondary');
  });

  it('should show icon button when display type is icon ', () => {
    component.displayType = 'icon';
    fixture.detectChanges();
    expect(element.querySelector('fa-icon').className).toBeTruthy();
  });

  it('should show disable button when "disabled" is set to "false" ', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(element.querySelector('button').disabled).toBeTruthy();
  });

  it('should throw productToQuote event when addToQuote is triggered.', () => {
    const emitter = spy(component.productToQuote);

    component.addToQuote();

    verify(emitter.emit()).once();
  });
});
