import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { ProductCompareService } from '../../../core/services/product-compare/product-compare.service';
import { ComparePageComponent } from './compare-page.component';


describe('Compare Page Component', () => {
  let fixture: ComponentFixture<ComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComparePageComponent],
      providers: [{ provide: ProductCompareService, useFactory: () => instance(mock(ProductCompareService)) }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageComponent);
    fixture.detectChanges();
  });

  it('should be created', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
