import * as prettier from 'prettier';

const print = val => {
  let source;
  if (val.getAttribute('ng-version')) {
    source = val.innerHTML;
  } else {
    const tmp = document.createElement('div');
    tmp.appendChild(val);
    source = tmp.innerHTML;
  }
  source = source
    .replace(/\n/g, '')
    .replace(/<!\-\-.*?\-\->/g, '')
    .replace(/ng-reflect-klass="[^"]*"/g, '')
    .replace(/ng-reflect-[a-z-]*="\[object Object]"/g, '');
  const result = prettier.format(source, { parser: 'html', printWidth: 100 }).replace(/^\s*$/g, '').trim();
  return result || 'N/A';
};

const test = val => val instanceof Element;

module.exports = {
  print: print,
  test: test,
};
