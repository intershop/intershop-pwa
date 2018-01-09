export class FactoryHelper {

  /**
   * Maps a object to an other.
   * @param input
   * @param output
   * @param only - list of keys which should be mapped to object. All keys will be mapped if not specified.
   */
  static primitiveMapping<T, S>(input: T, output: S, only: string[] = null) {

    Object.keys(input).forEach(key => {
      if (only && only.indexOf(key) === -1) {
        return;
      }
      if (typeof input[key] !== 'object') {
        output[key] = input[key];
      }
    });
  }

}
