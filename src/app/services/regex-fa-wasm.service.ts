import { Injectable } from '@angular/core';
import { AsyncSubject, map, Observable } from 'rxjs';
import { FlatDfa, HopcroftLog } from '../regex-fa/dfa';
import { FlatNfa, ScLog } from '../regex-fa/nfa';

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

  libCall<Input, Output>(funcName: string, args: Input): Observable<Output> {
    return this.libCall$.pipe(
      map((func) => {
        const argsStr = JSON.stringify(args);
        // console.log(argsStr);
        const resStr = func(funcName, argsStr);
        const res = JSON.parse(resStr) as Output;
        return res;
      }),
    );
  }

  dfaMinimize$(flatDfa: FlatDfa) {
    return this.libCall<FlatDfa, HopcroftLog>('DfaMinimize', flatDfa);
  }

  nfaToDfa$(flatNfa: FlatNfa) {
    return this.libCall<FlatNfa, ScLog>('NfaToDfa', flatNfa);
  }
}
