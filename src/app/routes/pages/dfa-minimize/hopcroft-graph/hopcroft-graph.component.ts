import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { Graph } from '@antv/g6';
import {
  FlatDfa,
  HopcroftFlatSplitTable,
  HopcroftSplitLog,
  toG6GraphData,
  toG6NodeId,
} from '../../../../regex-fa/dfa';
import { NzCardComponent } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-hopcroft-graph',
  standalone: true,
  imports: [NzCardComponent],
  templateUrl: './hopcroft-graph.component.html',
  styleUrl: './hopcroft-graph.component.less',
})
export class HopcroftGraphComponent implements AfterViewInit {
  destroyRef = inject(DestroyRef);

  @Input({ required: true }) flatDfa!: FlatDfa;
  @Input({ required: true }) hopcroftSplitLog!: HopcroftSplitLog;

  @ViewChild('sourceContainer') sourceContainer!: ElementRef;
  @ViewChild('targetContainer') targetContainer!: ElementRef;

  createStyle(baseColor: string) {
    return {
      fill: baseColor,
      stroke: baseColor,
      labelFill: '#fff',
      labelPadding: 2,
      labelBackgroundFill: baseColor,
      labelBackgroundRadius: 5,
    };
  }

  toBubbleSets(hopcroftFlatSplitTable: HopcroftFlatSplitTable) {
    const createStyle = (baseColor: string) => ({
      fill: baseColor,
      stroke: baseColor,
      labelFill: '#fff',
      labelPadding: 2,
      labelBackgroundFill: baseColor,
      labelBackgroundRadius: 5,
    });

    return hopcroftFlatSplitTable.splits.map((splits) => {
      return {
        key: `bubble-sets-${splits.splitId}`,
        type: 'bubble-sets',
        members: splits.states.map(toG6NodeId),
        // labelText: `bubble-sets-${splits.splitId}`,
        ...createStyle('#1783FF'),
      };
    });
  }

  ngAfterViewInit() {
    const sourceData = toG6GraphData(this.flatDfa);
    const sourceBubbleSets = this.hopcroftSplitLog.source.splits.map(
      (splits) => {
        if (splits.splitId != this.hopcroftSplitLog.split.splitId) {
          return {
            key: `bubble-sets-${splits.splitId}`,
            type: 'bubble-sets',
            members: splits.states.map(toG6NodeId),
            // labelText: `bubble-sets-${splits.splitId}`,
            ...this.createStyle('#1783FF'),
          };
        } else {
          return {
            key: `bubble-sets-${splits.splitId}`,
            type: 'bubble-sets',
            members: splits.states.map(toG6NodeId),
            labelText: `working on`,
            ...this.createStyle('#ffc53d'),
          };
        }
      },
    );

    for (const state of this.hopcroftSplitLog.split.states) {
      for (const edge of sourceData.edges!) {
        if (
          edge.source === toG6NodeId(state) &&
          edge['label'] === this.hopcroftSplitLog.splitTerminal
        ) {
          edge.style = {
            ...edge.style,
            stroke: '#cf1322',
          };
        }
      }
    }

    const width = this.sourceContainer.nativeElement!.width;
    const height = 500;
    const sourceGraph = new Graph({
      data: sourceData,
      container: this.sourceContainer.nativeElement,
      width,
      height,
      autoResize: true,
      autoFit: 'view',
      padding: 10,
      node: {},
      edge: {
        style: {
          labelBackground: true,
          endArrow: true,
          labelText: (d) => d['label'] as string,
        },
      },
      layout: {
        type: 'antv-dagre',
        align: 'UR',
      },
      behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
      transforms: ['process-parallel-edges'],
      plugins: [
        {
          type: 'toolbar',
          key: 'toolbar',
          position: 'top-left',
          onClick: (item: string) => {
            switch (item) {
              case 'reset':
                sourceGraph.render();
            }
          },
          getItems: () => {
            // G6 内置了 9 个 icon，分别是 zoom-in、zoom-out、redo、undo、edit、delete、auto-fit、export、reset
            return [
              // { id: 'zoom-in', value: 'zoom-in' },
              // { id: 'zoom-out', value: 'zoom-out' },
              // { id: 'redo', value: 'redo' },
              // { id: 'undo', value: 'undo' },
              // { id: 'edit', value: 'edit' },
              // { id: 'delete', value: 'delete' },
              // { id: 'auto-fit', value: 'auto-fit' },
              // { id: 'export', value: 'export' },
              { id: 'reset', value: 'reset' },
            ];
          },
        },
        ...sourceBubbleSets,
      ],
    });
    sourceGraph.render().then();

    // ------------------------------------------------------------------------------------------------

    const targetData = toG6GraphData(this.flatDfa);
    const targetBubbleSets = this.hopcroftSplitLog.target.splits.map(
      (splits) => {
        if (
          this.hopcroftSplitLog.newSplits.filter((s) => {
            return s.splitId === splits.splitId;
          }).length === 0
        ) {
          return {
            key: `bubble-sets-${splits.splitId}`,
            type: 'bubble-sets',
            members: splits.states.map(toG6NodeId),
            // labelText: `bubble-sets-${splits.splitId}`,
            ...this.createStyle('#1783FF'),
          };
        } else {
          return {
            key: `bubble-sets-${splits.splitId}`,
            type: 'bubble-sets',
            members: splits.states.map(toG6NodeId),
            labelText: `new split`,
            ...this.createStyle('#ffc53d'),
          };
        }
      },
    );

    const targetGraph = new Graph({
      data: targetData,
      container: this.targetContainer.nativeElement,
      width,
      height,
      autoResize: true,
      autoFit: 'view',
      padding: 10,
      node: {},
      edge: {
        style: {
          labelBackground: true,
          endArrow: true,
          labelText: (d) => d['label'] as string,
        },
      },
      layout: {
        type: 'antv-dagre',
        align: 'UR',
      },
      behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
      transforms: ['process-parallel-edges'],
      plugins: [
        {
          type: 'toolbar',
          key: 'toolbar',
          position: 'top-left',
          onClick: (item: string) => {
            switch (item) {
              case 'reset':
                sourceGraph.render();
            }
          },
          getItems: () => {
            // G6 内置了 9 个 icon，分别是 zoom-in、zoom-out、redo、undo、edit、delete、auto-fit、export、reset
            return [
              // { id: 'zoom-in', value: 'zoom-in' },
              // { id: 'zoom-out', value: 'zoom-out' },
              // { id: 'redo', value: 'redo' },
              // { id: 'undo', value: 'undo' },
              // { id: 'edit', value: 'edit' },
              // { id: 'delete', value: 'delete' },
              // { id: 'auto-fit', value: 'auto-fit' },
              // { id: 'export', value: 'export' },
              { id: 'reset', value: 'reset' },
            ];
          },
        },
        ...targetBubbleSets,
      ],
    });
    targetGraph.render().then();
  }
}
