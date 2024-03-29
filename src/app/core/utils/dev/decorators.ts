/* eslint-disable prefer-rest-params */
export function logMethod(target: object, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function () {
    const targetName = target.constructor.name;
    const args = JSON.stringify(arguments);
    /* eslint-disable no-console */
    console.log(`Calling ${targetName}.${key} with ${args}`);
    const result = original.apply(this, arguments);
    console.log(`Called ${targetName}.${key} with result ${result?.toString()}`);
    return result;
  };
  return descriptor;
}
