import { Component, DestroyRef, inject, input } from '@angular/core';
import { Terminal } from '../../regex-fa/regex-fa';
import { FormsModule } from '@angular/forms';
import { Dfa, FlatDfa } from '../../regex-fa/dfa';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { shareReplay, merge, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { filterUndefined, nullMap } from '../../tools/rxjs-tool';

interface TableRowParam {
  state: string;
  isS: boolean;
  isF: boolean;
  transTable: string[];
}

interface TableParams {
  statesSize: number;
  terminalsSize: number;
  terminals: Terminal[];
  rows: TableRowParam[];
}

@Component({
  selector: 'app-fa-table',
  imports: [
    NzInputModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzTableModule,
    FormsModule,
    NzRadioModule,
    AsyncPipe,
  ],
  templateUrl: './fa-table.component.html',
  styleUrl: './fa-table.component.less',
})
export class FaTableComponent {
  destroyRef$ = inject(DestroyRef);
  flatDfa = input<FlatDfa | null>();
  flatNfa = input<FlatDfa | null>();

  flatDfaTableParams$ = toObservable(this.flatDfa).pipe(
    filterUndefined(),
    nullMap(this.dfaToTableParams),
    shareReplay(1),
  );

  tableParams$: Observable<TableParams | null> = merge(
    this.flatDfaTableParams$,
  );

  dfaToTableParams(flatDfa: FlatDfa) {
    const dfa = new Dfa(flatDfa);
    const res: TableParams = {
      rows: [],
      statesSize: 0,
      terminals: [],
      terminalsSize: 0,
    };
    res.statesSize = flatDfa.states.length;
    res.terminals = dfa.getTerminals();
    res.terminalsSize = res.terminals.length;

    res.terminals.sort();
    flatDfa.states.sort();
    res.rows = flatDfa.states.map((state): TableRowParam => {
      return {
        isF: dfa.f.has(state),
        isS: dfa.s === state,
        state: state.toString(),
        transTable: res.terminals.map((terminal) => {
          if (!dfa.dfaTable.get(state)!.has(terminal)) {
            return '';
          } else {
            return dfa.dfaTable.get(state)!.get(terminal)!.toString();
          }
        }),
      };
    });
    return res;
  }
}
