import { FlatStates, StateId, States, Terminal } from './regex-fa';
import { FlatDfa, toG6GraphData } from './dfa';
import { tryEmplace } from '../tools/map-tool';

export type FlatNfa = FlatDfa;

export type NfaTransTable = Map<Terminal, States>;
export type NfaTable = Map<StateId, NfaTransTable>;

export class Nfa {
  nfaTable: NfaTable = new Map<StateId, NfaTransTable>();
  s: StateId;
  f: States;

  flatNfa: FlatDfa;

  constructor(flatNfa: FlatDfa) {
    this.flatNfa = flatNfa;
    this.s = flatNfa.s;
    this.f = new Set<StateId>(flatNfa.f);
    for (const state of flatNfa.states) {
      this.nfaTable.set(state, new Map<Terminal, States>());
    }
    for (const flatEdge of flatNfa.flatEdges) {
      const transTable = tryEmplace(
        this.nfaTable,
        flatEdge.source,
        new Map<Terminal, States>(),
      );
      tryEmplace(transTable, flatEdge.terminal, new Set<StateId>()).add(
        flatEdge.target,
      );
    }
  }

  getTerminals() {
    return [...new Set(this.flatNfa.flatEdges.map((edge) => edge.terminal))];
  }
}

/**
 * Check if nfa is legal, true for legal
 * @param flatNfa
 */
export function checkFlatNfa(flatNfa: FlatDfa): boolean {
  const states = new Set(flatNfa.states);
  function checkExistState(state: number) {
    if (!states.has(state)) {
      console.error(`checkFlatNfa: no such state ${state}`);
    }
    return states.has(state);
  }
  checkExistState(flatNfa.s);
  for (const f of flatNfa.f) {
    checkExistState(f);
  }
  for (const flatEdge of flatNfa.flatEdges) {
    checkExistState(flatEdge.source);
    checkExistState(flatEdge.target);
  }
  return true;
}

export function nfaToG6GraphData(flatNfa: FlatDfa) {
  return toG6GraphData(flatNfa);
}

export interface ScEdge {
  source: FlatStates;
  target: FlatStates;
  terminal: Terminal;
}

export interface ScStep {
  curSubset: FlatStates;
  scEdges: ScEdge[];
  newSubsets: FlatStates[];
  waitList: FlatStates[];
}

export interface ScTable {
  scStates: FlatStates[];
  scEdges: ScEdge[];
}

export interface ScLog {
  source: FlatDfa;
  target: FlatDfa;
  steps: ScStep[];
}
