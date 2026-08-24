const path = require('node:path');

const DATA_TESTING_ATTRIBUTE = / ?\[?(attr\.)?data-testing-[a-z-]*?\]?="([^"]*?)"/g;
const TEMPLATE_ROOTS = new Set(['projects', 'src']);

function removeDataTestingAttributes(source) {
  return source.replace(DATA_TESTING_ATTRIBUTE, '');
}

function isWorkspaceTemplate(fileName, workspaceRoot = process.cwd()) {
  if (path.extname(fileName).toLowerCase() !== '.html') {
    return false;
  }

  const relativePath = path.relative(workspaceRoot, fileName);
  if (!relativePath || path.isAbsolute(relativePath) || relativePath.startsWith(`..${path.sep}`)) {
    return false;
  }

  return TEMPLATE_ROOTS.has(relativePath.split(path.sep)[0]);
}

function installTemplateReadHook() {
  if (process.env.TESTING === 'true') {
    return;
  }

  // Angular AOT reads component HTML through the TypeScript host before esbuild sees the generated JavaScript.
  const ts = require('typescript');
  const workspaceRoot = process.cwd();
  const originalReadFile = ts.sys.readFile;

  ts.sys.readFile = (fileName, encoding) => {
    const source = originalReadFile(fileName, encoding);

    return source && isWorkspaceTemplate(fileName, workspaceRoot) ? removeDataTestingAttributes(source) : source;
  };
}

installTemplateReadHook();
