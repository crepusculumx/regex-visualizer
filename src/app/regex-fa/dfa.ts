import { FlatEdges, StateId, States, Terminal } from './regex-fa';
import { GraphData, NodeData } from '@antv/g6';

export interface FlatDfa {
  states: StateId[];
  flatEdges: FlatEdges;
  s: StateId;
  f: StateId[];
}

export type DfaTransTable = Map<Terminal, StateId>;
export type DfaTable = Map<StateId, DfaTransTable>;

export class Dfa {
  dfaTable: DfaTable = new Map<StateId, DfaTransTable>();
  s: StateId;
  f: States;

  flatDfa: FlatDfa;

  constructor(flatDfa: FlatDfa) {
    this.flatDfa = flatDfa;
    this.s = flatDfa.s;
    this.f = new Set<StateId>(flatDfa.f);
    for (const state of flatDfa.states) {
      this.dfaTable.set(state, new Map<Terminal, StateId>());
    }
    for (const flatEdge of flatDfa.flatEdges) {
      this.dfaTable
        .get(flatEdge.source)!
        .set(flatEdge.terminal, flatEdge.target);
    }
  }

  getTerminals() {
    return [...new Set(this.flatDfa.flatEdges.map((edge) => edge.terminal))];
  }
}

/**
 * Check if dfa is legal, true for legal
 * @param flatDfa
 */
export function checkFlatDfa(flatDfa: FlatDfa): boolean {
  const states = new Set(flatDfa.states);
  function checkExistState(state: number) {
    if (!states.has(state)) {
      console.error(`checkFlatDfa: no such state ${state}`);
    }
    return states.has(state);
  }
  checkExistState(flatDfa.s);
  for (const f of flatDfa.f) {
    checkExistState(f);
  }
  for (const flatEdge of flatDfa.flatEdges) {
    checkExistState(flatEdge.source);
    checkExistState(flatEdge.target);
  }
  return true;
}

export function toG6NodeId(stateId: number) {
  return `node-${stateId}`;
}

export function toG6GraphData(flatDfa: FlatDfa) {
  const f = new Set<number>(flatDfa.f);

  // 当没有节点时，添加一个虚拟起点
  if (flatDfa.states.length == 0) {
    flatDfa.states.push(0);
  }

  const graphData: GraphData = {
    nodes: flatDfa.states.map((stateId) => {
      let node: NodeData = {
        id: toG6NodeId(stateId),
        label: stateId.toString(),
      };

      if (f.has(stateId)) {
        node = {
          ...node,
          ...{
            type: 'circle',
            style: {
              size: 30,
              fill: '#FFFFFF',
              lineWidth: 5,
              stroke: '#5F95FF',
              labelPlacement: 'center',
              labelText: stateId.toString(),
            },
          },
        };
      } else {
        node = {
          ...node,
          ...{
            type: 'circle',
            style: {
              size: 30,
              fill: '#EFF4FF',
              lineWidth: 1,
              stroke: '#5F95FF',
              labelPlacement: 'center',
              labelText: stateId.toString(),
            },
          },
        };
      }
      return node;
    }),
    edges: flatDfa.flatEdges.map(({ source, target, terminal }, index) => {
      return {
        id: 'edge-' + index.toString(),
        source: 'node-' + source.toString(),
        target: 'node-' + target.toString(),
        label: terminal,
        type: source == target ? 'loop' : undefined,
      };
    }),
  };

  graphData.nodes!.push({
    id: 'node-S',
    type: 'circle',
    style: {
      size: 30,
      fill: '#FFFFFF',
      lineWidth: 0,
      stroke: '#5F95FF',
      labelPlacement: 'center',
      labelText: 'S',
    },
  });

  graphData.edges!.push({
    id: 'edge-S',
    source: 'node-S',
    target: 'node-' + flatDfa.s.toString(),
  });

  return graphData;
}

export interface HopcroftSplit {
  splitId: StateId;
  states: StateId[];
}

export interface HopcroftFlatSplitTable {
  splits: HopcroftSplit[];
}

export interface HopcroftSplitLog {
  splitTerminal: Terminal;
  source: HopcroftFlatSplitTable;
  target: HopcroftFlatSplitTable;
  split: HopcroftSplit;
  newSplits: HopcroftSplit[];
}

export interface HopcroftLog {
  source: FlatDfa;
  target: FlatDfa;
  hopcroftSplitLogs: HopcroftSplitLog[];
}
