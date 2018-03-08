import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { MockComponent } from '../../../utils/dev/mock.component';
import { ComparePageContainerComponent } from './compare-page.container';

describe('Compare Page Container', () => {
  let fixture: ComponentFixture<ComparePageContainerComponent>;
  let element: HTMLElement;
  let component: ComparePageContainerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({ selector: 'ish-product-compare-list', template: 'Product Compare List Component', inputs: ['compareProducts'] }),
        ComparePageContainerComponent,
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Store, useFactory: () => instance(mock(Store)) }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageContainerComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
