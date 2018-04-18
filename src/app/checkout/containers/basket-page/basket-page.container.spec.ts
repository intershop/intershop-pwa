import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { BasketPageContainerComponent } from './basket-page.container';

describe('Basket Page Container', () => {
  let component: BasketPageContainerComponent;
  let fixture: ComponentFixture<BasketPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [BasketPageContainerComponent],
        imports: [TranslateModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
