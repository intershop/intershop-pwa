module.exports = function dataCyLoader(source) {
  // console.log('loading', source)
  var dataAttr = /\ ?\[?(attr\.)?data-testing-[a-z-]*?\]?="([^"]*?)"/g;
  if (dataAttr.test(source)) {
    source = source.replace(dataAttr, '');
  }
  return source;
};
