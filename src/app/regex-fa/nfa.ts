import { FlatStates, Terminal } from './regex-fa';
import { FlatDfa, toG6GraphData } from './dfa';

export type FlatNfa = FlatDfa;

/**
 * Check if nfa is legal, true for legal
 * @param flatNfa
 */
export function checkFlatNfa(flatNfa: FlatNfa): boolean {
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

export function nfaToG6GraphData(flatNfa: FlatNfa) {
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
  source: FlatNfa;
  target: FlatDfa;
  steps: ScStep[];
}
