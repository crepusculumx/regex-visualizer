import { Route } from '@angular/router';

import { BasicLayoutComponent } from '../layout/basic-layout/basic-layout.component';
import { DfaComponent } from './pages/dfa/dfa.component';
import { DfaMinimizeComponent } from './pages/dfa-minimize/dfa-minimize.component';
import { NfaComponent } from './pages/nfa/nfa.component';
import { NfaToDfaComponent } from './pages/nfa-to-dfa/nfa-to-dfa.component';
import { FaListComponent } from './pages/fa-list/fa-list.component';
import { FaType } from '../services/fa-db.service';

export default [
  {
    path: '',
    component: BasicLayoutComponent,
    children: [
      {
        path: `${FaType.DFA}`,
        component: DfaComponent,
      },
      {
        path: `${FaType.DFA}/:digest`,
        component: DfaComponent,
      },
      {
        path: `${FaType.NFA}`,
        component: NfaComponent,
      },
      {
        path: `${FaType.NFA}/:digest`,
        component: NfaComponent,
      },
      {
        path: 'dfa-minimize',
        component: DfaMinimizeComponent,
      },
      {
        path: 'nfa-to-dfa',
        component: NfaToDfaComponent,
      },
      {
        path: 'fa-list',
        component: FaListComponent,
      },
    ],
  },
] as Route[];
