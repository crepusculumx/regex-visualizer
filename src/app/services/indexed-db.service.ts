import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, Subscriber, switchMap } from 'rxjs';
import { stores } from './indexed-db-stores';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbName = 'fa-db';
  private dbVersion = 1;
  private db$ = new AsyncSubject<IDBDatabase>();

  constructor() {
    this.initDB();
  }

  private initStore(db: IDBDatabase) {
    for (const [storeName, key] of Object.entries(stores)) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: key });
      }
    }
  }

  private initDB(): void {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      this.initStore(db);
    };

    request.onsuccess = () => {
      const db = request.result;
      this.db$.next(db);
      this.db$.complete();
      this.initStore(db);
    };

    request.onerror = (event) => {
      console.error(
        'Database error:',
        (event.target as IDBOpenDBRequest).error,
      );
    };
  }

  addItem$<T>(storeName: string, item: T): Observable<IDBValidKey> {
    return this.db$.pipe(
      switchMap((db) => {
        return new Observable((observer: Subscriber<IDBValidKey>) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.add(item);

          request.onsuccess = () => {
            observer.next(request.result);
            observer.complete();
          };

          request.onerror = (event) => {
            observer.error((event.target as IDBRequest).error);
          };
        });
      }),
    );
  }

  getItem$<T>(storeName: string, key: IDBValidKey): Observable<T | undefined> {
    return this.db$.pipe(
      switchMap((db) => {
        return new Observable((observer: Subscriber<T | undefined>) => {
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(key);

          request.onsuccess = () => {
            observer.next(request.result);
            observer.complete();
          };

          request.onerror = (event) => {
            observer.error((event.target as IDBRequest).error);
          };
        });
      }),
    );
  }

  getAllItems$<T>(storeName: string): Observable<T[]> {
    return this.db$.pipe(
      switchMap((db) => {
        return new Observable((observer: Subscriber<T[]>) => {
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.getAll();

          request.onsuccess = () => {
            observer.next(request.result);
            observer.complete();
          };

          request.onerror = (event) => {
            observer.error((event.target as IDBRequest).error);
          };
        });
      }),
    );
  }

  updateItem$<T>(storeName: string, item: T): Observable<IDBValidKey> {
    return this.db$.pipe(
      switchMap((db) => {
        return new Observable((observer: Subscriber<IDBValidKey>) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.put(item);

          request.onsuccess = () => {
            observer.next(request.result);
            observer.complete();
          };

          request.onerror = (event) => {
            observer.error((event.target as IDBRequest).error);
          };
        });
      }),
    );
  }

  deleteItem$(storeName: string, key: IDBValidKey): Observable<undefined> {
    return this.db$.pipe(
      switchMap((db) => {
        return new Observable((observer: Subscriber<undefined>) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.delete(key);

          request.onsuccess = () => {
            observer.next(request.result);
            observer.complete();
          };

          request.onerror = (event) => {
            observer.error((event.target as IDBRequest).error);
          };
        });
      }),
    );
  }

  clearItem$(storeName: string): Observable<undefined> {
    return this.db$.pipe(
      switchMap((db) => {
        return new Observable((observer: Subscriber<undefined>) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.clear();

          request.onsuccess = () => {
            observer.next(request.result);
            observer.complete();
          };

          request.onerror = (event) => {
            observer.error((event.target as IDBRequest).error);
          };
        });
      }),
    );
  }
}
