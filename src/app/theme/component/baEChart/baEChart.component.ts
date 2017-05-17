import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  ElementRef,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

import * as echarts from 'echarts';

@Component({
  selector: 'ba-echarts',
  template: '',
  host: {
    '[style.display]': '"block"',
    '[style.width]': 'width',
    '[style.height]': 'height'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'chart'
})
export class EChartsComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() options: any;
  @Input() width = '100%';
  @Input() height = '400px';
  @Input() theme: Object|string;
  @Output() chartCreated = new EventEmitter<EChartsComponent>();
  chart: any;
  // event: 'click'、'dblclick'、'mousedown'、'mousemove'、'mouseup'、'mouseover'、'mouseout'

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.chart = (<any>echarts).init(this.elementRef.nativeElement, this.theme);
    this.updateChartData(this.options);
    this.chartCreated.emit(this);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && changes['options']) {
      const currentValue = changes['options'].currentValue;
      this.updateChartData(currentValue);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  updateChartData(options: any, notMerge?: boolean, lazyUpdate?: boolean) {
    if (options) {
      this.chart.setOption(options, notMerge, lazyUpdate);
    }
  }

  resize() {
    this.chart.resize();
  }

  showLoading(type?: string, opts?: Object) {
    this.chart.showLoading(type, opts);
  }

  hideLoading() {
    this.chart.hideLoading();
  }

  getDataURL(opts) {
    return this.chart.getDataURL(opts);
  }
}
