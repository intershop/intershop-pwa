import { asTree } from 'treeify';

const arrayToObject = (val, edges) =>
  val.reduce((tree, node) => {
    tree[node] = edges[node] ? arrayToObject(edges[node], edges) : undefined;
    return tree;
  }, {});

const serializeCategoryTree = ct => {
  const tree = arrayToObject(ct.rootIds, ct.edges);
  const assignedKeys = Object.keys(ct.edges)
    .filter(key => key in ct.nodes)
    .reduce((acc, key) => [...acc, ...ct.edges[key]], [])
    .concat(ct.rootIds);
  const danglingKeys = Object.keys(ct.nodes).filter(key => !assignedKeys.includes(key));
  if (danglingKeys.length) {
    tree.dangling = arrayToObject(danglingKeys, ct.edges);
  }
  return asTree(tree);
};

const test = val => val && val.rootIds && val.edges && val.nodes;

module.exports = {
  print: serializeCategoryTree,
  test: test,
};
