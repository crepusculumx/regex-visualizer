import { StateId, Terminal } from './regex-fa';
import { GraphData, NodeData } from '@antv/g6';

export interface FlatEdge {
  source: StateId;
  target: StateId;
  terminal: Terminal;
}

export type FlatEdges = FlatEdge[];

export interface FlatDfaTable {
  states: StateId[];
  flatEdges: FlatEdge[];
}

export interface FlatDfa {
  dfaTable: FlatDfaTable;
  s: StateId;
  f: StateId[];
}

export function toG6NodeId(stateId: number) {
  return `node-${stateId}`;
}

export function toG6GraphData(flatDfa: FlatDfa) {
  const f = new Set<number>(flatDfa.f);

  // 当没有节点时，添加一个虚拟起点
  if (flatDfa.dfaTable.states.length == 0) {
    flatDfa.dfaTable.states.push(0);
  }

  const graphData: GraphData = {
    nodes: flatDfa.dfaTable.states.map((stateId) => {
      let node: NodeData = {
        id: toG6NodeId(stateId),
        label: stateId.toString(),
      };

      if (f.has(stateId)) {
        node = {
          ...node,
          ...{
            type: 'triangle',
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
    edges: flatDfa.dfaTable.flatEdges.map(
      ({ source, target, terminal }, index) => {
        return {
          id: 'edge-' + index.toString(),
          source: 'node-' + source.toString(),
          target: 'node-' + target.toString(),
          label: terminal,
          type: source == target ? 'loop' : undefined,
        };
      },
    ),
  };

  graphData.nodes!.push({
    id: 'node-S',
    type: 'diamond',
    style: {
      size: 30,
      fill: '#EFF4FF',
      lineWidth: 1,
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
