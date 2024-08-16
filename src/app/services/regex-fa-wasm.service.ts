import { Injectable } from '@angular/core';
import { AsyncSubject, map } from 'rxjs';
import { FlatDfa, HopcroftLog } from '../regex-fa/dfa';

// eslint-disable-next-line
declare const Module: any;

@Injectable({
  providedIn: 'root',
})
export class RegexFaWasmService {
  libCall$ = new AsyncSubject<(funcName: string, args: string) => string>();

  constructor() {
    const script = document.createElement('script');
    script.src = 'fa_wasm.js';
    document.body.appendChild(script);
    script.onload = () => {
      Module.onRuntimeInitialized = () => {
        const func = Module.cwrap('LibCall', 'string', ['string', 'string']);
        this.libCall$.next(func);
        this.libCall$.complete();
      };
    };
  }

  dfaMinimize$(flatDfa: FlatDfa) {
    return this.libCall$.pipe(
      map((func) => {
        const args = JSON.stringify(flatDfa);
        const res = func('DfaMinimize', args);
        const resDFa: HopcroftLog = JSON.parse(res);
        return resDFa;
      }),
    );
  }
}
