const flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], []);

export interface IshDomNode {
  name: string;
  children: IshDomNode[];
  dqn?: string;
}

export class IshTreeNode {
  name: string;
  dqn?: string;
  children: IshTreeNode[];

  constructor(nodeData: IshDomNode) {
    this.name = nodeData.name;
    this.dqn = nodeData.dqn;
    this.children = nodeData.children && nodeData.children.map(d => new IshTreeNode(d));
    this.reduce();
  }

  private reduce() {
    if (this.children && this.children.length > 0) {
      this.children = [
        ...this.children.filter(c => c.dqn),
        ...flatMap(c => c.children, this.children.filter(c => !c.dqn)),
      ].filter(x => !!x);
    }
  }
}
