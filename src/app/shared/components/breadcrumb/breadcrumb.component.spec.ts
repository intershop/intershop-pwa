import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadCrumb Component', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let component: BreadcrumbComponent;
  let element: HTMLElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(mock(CategoriesService)) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
