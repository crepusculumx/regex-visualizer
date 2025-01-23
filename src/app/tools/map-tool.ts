export function tryEmplace<K, V>(map: Map<K, V>, key: K, value: V): V {
  if (map.has(key)) {
    return map.get(key)!;
  }
  map.set(key, value);
  return map.get(key)!;
}
