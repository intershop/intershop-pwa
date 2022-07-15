const { default: HasteMap } = require('jest-haste-map');

/**
 * custom haste map implementation that ignores test relations over certain boundaries
 */
class CustomHasteMap extends HasteMap {
  _ignore(filePath) {
    if (/\.(module|facade)\.ts$/.test(filePath) && !/(store|shared)\.module\.ts$/.test(filePath)) {
      return true;
    }
    return false;
  }
}

module.exports.default = CustomHasteMap;
