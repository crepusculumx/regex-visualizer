import { Component } from '@angular/core';
import { DfaInputComponent } from '../../dfa-input/dfa-input.component';
import { FaGraphComponent } from '../../fa-graph/fa-graph.component';
import { map, ReplaySubject, switchMap } from 'rxjs';
import { FlatDfa, toG6GraphData } from '../../../regex-fa/dfa';
import { RegexFaWasmService } from '../../../services/regex-fa-wasm.service';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { HopcroftGraphComponent } from './hopcroft-graph/hopcroft-graph.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dfa-minimize',
  standalone: true,
  imports: [
    DfaInputComponent,
    FaGraphComponent,
    NzCardComponent,
    NzCollapseModule,
    AsyncPipe,
    HopcroftGraphComponent,
    NgIf,
    NgForOf,
  ],
  templateUrl: './dfa-minimize.component.html',
  styleUrl: './dfa-minimize.component.less',
})
export class DfaMinimizeComponent {
  constructor(private regexService: RegexFaWasmService) {}

  inputDfa$ = new ReplaySubject<FlatDfa>(1);
  inputDfa = toSignal(this.inputDfa$);

  inputDfaG6$ = this.inputDfa$.pipe(
    map((flatDfa) => {
      return toG6GraphData(flatDfa);
    }),
  );

  hopcroftLog$ = this.inputDfa$.pipe(
    switchMap((inputDfa) => {
      return this.regexService.dfaMinimize$(inputDfa);
    }),
  );

  minimizeDfaG6$ = this.hopcroftLog$.pipe(
    map((hopcroftLog) => {
      return toG6GraphData(hopcroftLog.target);
    }),
  );
  protected readonly JSON = JSON;
}
