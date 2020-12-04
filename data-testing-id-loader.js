export default function dataTestingIdLoader(source) {
  var dataAttr = 'data-testing-id="([^"]*)"';
  if (source.match(dataAttr)) {
    source = source.replace(new RegExp(dataAttr, 'g'), '');
  }
  return source;
}
