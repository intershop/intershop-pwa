import { CdkTreeModule } from '@angular/cdk/tree';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DynamicFlatNode } from 'ish-core/utils/tree/tree.interface';

import { TreeComponent } from './tree.component';

describe('Tree Component', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;
  let element: HTMLElement;

  const dynamicFlatNodeList = [
    {
      id: 'intershopId',
      displayName: 'Intershop',
      level: 0,
      expandable: true,
      childrenIds: ['intershopJenaId'],
    },
    {
      id: 'intershopJenaId',
      displayName: 'Intershop Jena',
      level: 1,
      expandable: true,
      parentId: 'intershopId',
      childrenIds: ['intershopJenaRNDId', 'intershopJenaSupportId'],
    },
    {
      id: 'intershopJenaRNDId',
      displayName: 'Intershop Jena RND',
      level: 2,
      expandable: true,
      parentId: 'intershopJenaId',
      childrenIds: ['konsumId'],
    },
    {
      id: 'konsumId',
      displayName: 'Intershop Team Konsum',
      level: 3,
      expandable: false,
      parentId: 'intershopJenaRNDId',
    },
    {
      id: 'intershopJenaSupportId',
      displayName: 'Intershop Jena Support',
      level: 2,
      expandable: false,
      parentId: 'intershopJenaId',
    },
  ] as DynamicFlatNode[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdkTreeModule, TranslateModule.forRoot()],
      declarations: [TreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.baseData$ = of(dynamicFlatNodeList);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should initial displayed only the root node', () => {
    fixture.detectChanges();
    const cdkTreeNode = element.querySelectorAll('cdk-tree-node');

    expect((cdkTreeNode[0] as HTMLElement).getAttribute('style')).toContain('display: block');
    for (let i = 1; i < cdkTreeNode.length; i++) {
      expect((cdkTreeNode[i] as HTMLElement).getAttribute('style')).toContain('display: none');
    }
  });

  it('should display child nodes if toggle parent', () => {
    fixture.detectChanges();
    const cdkTreeNode = element.querySelectorAll('cdk-tree-node');

    (cdkTreeNode[0] as HTMLElement).childNodes.forEach(node => {
      if (node instanceof HTMLButtonElement) {
        node.click();
      }
    });
    fixture.detectChanges();
    for (let i = 0; i < cdkTreeNode.length; i++) {
      i > 1
        ? expect((cdkTreeNode[i] as HTMLElement).getAttribute('style')).toContain('display: none')
        : expect((cdkTreeNode[i] as HTMLElement).getAttribute('style')).toContain('display: block');
    }
  });

  it('should hide child nodes if collapse parent', () => {
    fixture.detectChanges();
    const cdkTreeNode = element.querySelectorAll('cdk-tree-node');

    // open subtree
    (cdkTreeNode[0] as HTMLElement).childNodes.forEach(node => {
      if (node instanceof HTMLButtonElement) {
        node.click();
      }
    });
    fixture.detectChanges();
    // close subtree
    (cdkTreeNode[0] as HTMLElement).childNodes.forEach(node => {
      if (node instanceof HTMLButtonElement) {
        node.click();
      }
    });
    fixture.detectChanges();
    for (let i = 0; i < cdkTreeNode.length; i++) {
      i > 0
        ? expect((cdkTreeNode[i] as HTMLElement).getAttribute('style')).toContain('display: none')
        : expect((cdkTreeNode[i] as HTMLElement).getAttribute('style')).toContain('display: block');
    }
  });
});
