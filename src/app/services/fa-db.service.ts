import { inject, Injectable } from '@angular/core';
import { concatMap, map, Observable, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IndexedDBService } from './indexed-db.service';
import { FlatFa } from '../regex-fa/regex-fa';
import { StoreNames } from './indexed-db-stores';
import { NzMessageService } from 'ng-zorro-antd/message';

export enum FaType {
  'DFA' = 'DFA',
  'NFA' = 'NFA',
}

export interface FaData {
  name: string;
  type: FaType;
  data: string;
  digest: string;
}

export function faDataToFa(faData: FaData): FlatFa {
  return JSON.parse(faData.data);
}

@Injectable({
  providedIn: 'root',
})
export class FaDbService {
  private readonly idbService = inject(IndexedDBService);
  private readonly message = inject(NzMessageService);

  private readonly storeName = StoreNames.FaDb;

  private digest$(message: string, algo = 'SHA-1') {
    return fromPromise(
      crypto.subtle.digest(algo, new TextEncoder().encode(message)),
    ).pipe(
      map((data) => {
        return Array.from(new Uint8Array(data), (byte) =>
          byte.toString(16).padStart(2, '0'),
        ).join('');
      }),
    );
  }

  removeFaData$(digest: string) {
    return this.idbService.deleteItem$(this.storeName, digest);
  }

  getFaData$(digest: string): Observable<FaData | null> {
    return this.idbService.getItem$<FaData>(this.storeName, digest).pipe(
      map((data) => (data === undefined ? null : data)),
      tap((data) => {
        if (data === null) {
          this.message.error(`未能找到模型：${digest}`);
        }
      }),
    );
  }

  addFaData$(name: string, type: FaType, data: FlatFa) {
    const faData: FaData = {
      data: JSON.stringify(data),
      digest: '',
      name,
      type,
    };
    return this.digest$(JSON.stringify(faData)).pipe(
      map((digest) => {
        faData.digest = digest;
        return faData;
      }),
      concatMap((faData) => {
        return this.idbService.updateItem$(
          this.storeName,
          faData,
        ) as Observable<string>;
      }),
    );
  }

  updateFaData$(digest: string, name: string, type: FaType, data: FlatFa) {
    return this.removeFaData$(digest).pipe(
      concatMap(() => {
        return this.addFaData$(name, type, data);
      }),
    );
  }

  getAllFaData$() {
    return this.idbService.getAllItems$<FaData>(this.storeName);
  }
}
