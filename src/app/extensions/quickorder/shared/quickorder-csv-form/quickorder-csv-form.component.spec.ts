import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { QuickorderCsvFormComponent } from './quickorder-csv-form.component';

describe('Quickorder Csv Form Component', () => {
  let component: QuickorderCsvFormComponent;
  let fixture: ComponentFixture<QuickorderCsvFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickorderCsvFormComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderCsvFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
