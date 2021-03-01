const serializeValue = v => {
  if (v === undefined) {
    return ' ' + v;
  }
  let stringified;
  if (v instanceof Array) {
    stringified = ' ' + JSON.stringify(v);
  } else if (v.rootIds && v.edges && v.nodes) {
    stringified = ` tree(${Object.keys(v.nodes)})`;
  } else {
    stringified = ' ' + JSON.stringify(v, (_, val) => (val instanceof Array ? [val.length] : val));
  }
  return stringified.length >= 64 ? stringified.substring(0, 61) + '...' : stringified;
};

const serializePayload = v => {
  return Object.entries(v)
    .map(([key, val]) => `${key}:${serializeValue(val)}`)
    .join('\n');
};

const print = (val, _, indent) => {
  let ret = val.type;
  if (val.payload) {
    const stringified = serializePayload(val.payload);
    ret += ':\n' + indent(stringified);
  }
  return ret;
};

const test = val => {
  return (
    !!val &&
    typeof val === 'object' &&
    Object.keys(val).includes('type') &&
    Object.keys(val).every(key => ['type', 'payload'].includes(key))
  );
};

module.exports = {
  print: print,
  test: test,
};
