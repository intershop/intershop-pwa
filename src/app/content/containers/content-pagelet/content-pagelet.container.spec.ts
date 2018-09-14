import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';

import { ContentPageletContainerComponent } from './content-pagelet.container';

describe('Content Pagelet Container', () => {
  let component: ContentPageletContainerComponent;
  let fixture: ComponentFixture<ContentPageletContainerComponent>;
  let element: HTMLElement;
  let pagelet: ContentPagelet;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentPageletContainerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageletContainerComponent);
    component = fixture.componentInstance;
    pagelet = {
      definitionQualifiedName: 'fq',
      displayName: 'name',
      id: 'id',
      configurationParameters: {
        HTMLText: 'foo',
      },
    };
    component.pagelet = pagelet;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
