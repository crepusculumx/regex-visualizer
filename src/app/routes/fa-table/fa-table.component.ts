import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Terminal } from '../../regex-fa/regex-fa';
import { FormsModule } from '@angular/forms';
import { FlatNfa } from '../../regex-fa/nfa';
import { Dfa, FlatDfa } from '../../regex-fa/dfa';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { map, Observable, ReplaySubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class FaTableComponent implements OnInit {
  destroyRef$ = inject(DestroyRef);
  @Input() flatDfa$: Observable<FlatDfa> | null = null;
  @Input() flatNfa$: Observable<FlatNfa> | null = null;

  tableParams$ = new ReplaySubject<TableParams>(1);

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

  ngOnInit() {
    if (this.flatDfa$) {
      this.flatDfa$
        .pipe(map(this.dfaToTableParams), takeUntilDestroyed(this.destroyRef$))
        .subscribe(this.tableParams$);
    }
  }
}
