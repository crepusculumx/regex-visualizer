export function mapUndefinedToNull<T, V extends NonNullable<T>>(
  data: V | undefined,
): V | null {
  return data ? data : null;
}
