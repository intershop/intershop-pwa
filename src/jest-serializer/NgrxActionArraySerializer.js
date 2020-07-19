const print = (val, serialize) => {
  return val.map(serialize).join('\n');
};

const test = val => {
  return (
    val instanceof Array &&
    val.length &&
    val.every(
      action =>
        typeof action === 'object' &&
        Object.keys(action).includes('type') &&
        Object.keys(action).filter(key => !['type', 'payload'].includes(key)).length === 0
    )
  );
};

module.exports = {
  print: print,
  test: test,
};
