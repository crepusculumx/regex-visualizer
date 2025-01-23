import {
  filter,
  from,
  map,
  ObservableInput,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from 'rxjs';

export function addPre<T, A>(pre: T) {
  return switchMap((input: A) => {
    return from([pre, input]);
  });
}

export function rxLog<T>(pre: string) {
  return tap((data: T) => {
    console.log(pre);
    console.log(data);
  });
}

export function undefinedToNull<T>() {
  return map((data: T) => {
    return data ? data : null;
  });
}

export function filterNull<T>() {
  return filter((data: T | null): data is T => {
    return data !== null;
  });
}

export function filterUndefined<T>() {
  return filter((data: T | undefined): data is T => {
    return data !== undefined;
  });
}

export function nullMap<T, R>(project: (value: T, index: number) => R) {
  return map((data: T | null, index) => {
    if (data === null) {
      return null;
    }
    return project(data, index);
  });
}
export function nullSwitchMap<T, V extends Exclude<T, null>, O>(
  project: (value: V, index: number) => ObservableInput<O>,
): OperatorFunction<T, O | null> {
  return switchMap((data: T | null, index): ObservableInput<O | null> => {
    if (data == null) {
      return of(null);
    }
    return project(data as V, index);
  });
}
