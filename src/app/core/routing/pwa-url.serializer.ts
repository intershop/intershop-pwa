import { DefaultUrlSerializer, UrlSegment, UrlSegmentGroup, UrlSerializer, UrlTree } from '@angular/router';

function removeMatrixParametersFromGroup(group: UrlSegmentGroup): UrlSegmentGroup {
  return new UrlSegmentGroup(
    group.segments.map(segment => new UrlSegment(segment.path, {})),
    Object.entries(group.children).reduce(
      (acc, [key, group]) => ({ ...acc, [key]: removeMatrixParametersFromGroup(group) }),
      {}
    )
  );
}

function removeMatrixParameters(tree: UrlTree): UrlTree {
  const newTree = new UrlTree();
  newTree.root = removeMatrixParametersFromGroup(tree.root);
  newTree.fragment = tree.fragment;
  newTree.queryParams = tree.queryParams;
  return newTree;
}

/**
 * Custom serializer for allowing parenthesis in URLs and removing matrix parameters
 *
 * taken from: https://github.com/angular/angular/issues/10280#issuecomment-309129784
 */
export class PWAUrlSerializer implements UrlSerializer {
  private defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    const newUrl = url.replace(/\(/g, '%28').replace(/\)/g, '%29');
    return this.defaultUrlSerializer.parse(newUrl);
  }

  serialize(tree: UrlTree): string {
    return (
      this.defaultUrlSerializer
        .serialize(removeMatrixParameters(tree))
        // display parenthesis unencoded in URL
        .replace(/%28/g, '(')
        .replace(/%29/g, ')')
    );
  }
}
