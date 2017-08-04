/* SystemJS module definition */
interface NodeRequireFunction {
  (id: string): any;
}

interface NodeRequire extends NodeRequireFunction {
  cache: any;
  extensions: any;
  main: NodeModule | undefined;

  resolve(id: string): string;
}

declare var require: NodeRequire;

interface NodeModule {
  exports: any;
  require: NodeRequireFunction;
  id: string;
  filename: string;
  loaded: boolean;
  parent: NodeModule | null;
  children: NodeModule[];
}

declare var module: NodeModule;
