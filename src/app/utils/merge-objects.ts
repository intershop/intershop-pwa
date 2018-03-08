export function mergeObjectsMutably<T>(destination: T, notUpdateable: string[], ...sources: T[]) {
  sources.forEach(s => {
    Object.keys(s)
      .filter(k => !notUpdateable.includes(k))
      .forEach(k => destination[k] = s[k]);
  });
  return destination;
}
