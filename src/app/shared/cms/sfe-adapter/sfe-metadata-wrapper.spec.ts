import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SfeMetadataWrapper } from './sfe-metadata-wrapper';
import { SfeMetadata } from './sfe.types';

@Component({ template: '' })
class SfeTestComponent extends SfeMetadataWrapper {}

describe('Sfe Metadata Wrapper', () => {
  let component: SfeTestComponent;
  let fixture: ComponentFixture<SfeTestComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SfeTestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SfeTestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should add SFE attribute with metadata to the DOM element', () => {
    const dataAttrName = 'sfe';

    const metadata: SfeMetadata = {
      id: 'abc',
      displayName: 'dname',
      displayType: 'Pagelet',
      renderObject: {
        id: 'def',
        domainId: 'domain',
        type: 'Pagelet',
      },
    };

    component.setSfeMetadata(metadata);
    fixture.detectChanges();

    expect(element.hasAttribute('data-' + dataAttrName)).toBeTruthy();

    const rawData = element.dataset.sfe;
    const data = JSON.parse(rawData);
    expect(data).toEqual(metadata);
  });
});
