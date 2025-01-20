import { from, switchMap, tap } from 'rxjs';

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
