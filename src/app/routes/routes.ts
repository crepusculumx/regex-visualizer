import { Route } from '@angular/router';

import { BasicLayoutComponent } from '../layout/basic-layout/basic-layout.component';
import { DfaComponent } from './pages/dfa/dfa.component';
import { DfaMinimizeComponent } from './pages/dfa-minimize/dfa-minimize.component';
import { NfaComponent } from './pages/nfa/nfa.component';

export default [
  {
    path: '',
    component: BasicLayoutComponent,
    children: [
      {
        path: 'dfa',
        component: DfaComponent,
      },
      {
        path: 'nfa',
        component: NfaComponent,
      },
      {
        path: 'dfa-minimize',
        component: DfaMinimizeComponent,
      },
    ],
  },
] as Route[];
