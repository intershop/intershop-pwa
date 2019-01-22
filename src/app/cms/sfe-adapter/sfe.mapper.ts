import { ContentEntryPointView, ContentPageletView } from 'ish-core/models/content-view/content-views';

import { SfeDomNode, SfeMetadata, SfeMetadataNode } from './sfe.types';

// tslint:disable:project-structure
export class SfeMapper {
  static getDomTree(node: Node): SfeDomNode {
    const attributeName = 'data-sfe';

    let children = [];

    if (node.hasChildNodes()) {
      children = Array.from(node.childNodes)
        .filter(child => child.nodeName)
        .map(child => SfeMapper.getDomTree(child))
        .filter(n => n.name && (n.hasOwnProperty('sfeMetadata') || n.children.length));
    }

    const output: SfeDomNode = {
      name: node.nodeName.toLowerCase(),
      children,
    };

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.hasAttribute(attributeName)) {
        const json = el.getAttribute(attributeName);
        if (json) {
          output.sfeMetadata = JSON.parse(json);
        }
      }
    }
    return output;
  }

  static reduceDomTree(node: SfeDomNode): SfeMetadataNode {
    const children = node.children
      .map(child => SfeMapper.reduceDomTree(child))
      .reduce((acc, child) => [...acc, ...(child.id ? [child] : child.children)], [])
      .filter(n => n);

    return {
      ...node.sfeMetadata,
      children,
    };
  }

  static mapIncludeViewToSfeMetadata(include: ContentEntryPointView): SfeMetadata {
    return {
      id: `include:${include.domain}:${include.id}`,
      displayName: include.displayName,
      displayType: 'Include',
      renderObject: {
        id: include.id,
        domainId: include.domain,
        type: 'Include',
      },
    };
  }

  static mapPageletViewToSfeMetadata(pagelet: ContentPageletView): SfeMetadata {
    const dqnSplit = pagelet.definitionQualifiedName.split('-');
    const displayType = dqnSplit[dqnSplit.length - 1];
    return {
      id: `pagelet:${pagelet.domain}:${pagelet.id}`,
      displayName: pagelet.displayName,
      displayType,
      renderObject: {
        id: pagelet.id,
        domainId: pagelet.domain,
        type: 'Pagelet',
      },
    };
  }

  static mapSlotViewToSfeMetadata(pagelet: ContentPageletView, slot: string): SfeMetadata {
    return {
      id: `slot:${pagelet.domain}:${slot}:${pagelet.id}`, // TODO
      displayName: pagelet.slot(slot).displayName,
      displayType: 'Slot',
      renderObject: {
        id: slot,
        domainId: pagelet.domain,
        type: 'Slot',
        parentPageletId: pagelet.id,
        parentPageletDomain: pagelet.domain,
      },
    };
  }
}
