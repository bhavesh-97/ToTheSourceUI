export function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge (immutable) — merges source into target producing a new object.
 * Arrays are replaced (not concatenated) — adjust if you want different behavior.
 */
export function deepMerge<T = any>(target: T, source: Partial<T>): T {
  if (!isObject(target)) return (source as unknown) as T;
  const output: any = { ...target };
  if (isObject(source)) {
    Object.keys(source).forEach(key => {
      const srcVal = (source as any)[key];
      const tgtVal = (target as any)[key];
      if (isObject(srcVal) && isObject(tgtVal)) {
        output[key] = deepMerge(tgtVal, srcVal);
      } else {
        output[key] = srcVal;
      }
    });
  }
  return output;
}
