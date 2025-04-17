import React, { useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import * as echarts from 'echarts';
import { getChartDataFromFrame } from '../chartDataParser';
import { SimpleOptions } from '../types';
import { Button, Modal } from '@grafana/ui';
interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ data, width, height, options }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.series.length === 0) return;

    const chart = echarts.init(chartRef.current);
    const series = data.series[0];
    const parsed = getChartDataFromFrame(series, options);

    if (!parsed.valid) {
      chart.setOption({
        title: { text: parsed.message || 'Invalid data' },
      });
      return;
    }

    // Convert string boolean to actual boolean for showLegend and enableAnimation
    const showLegend = options.showLegend === 'true';
    const enableAnimation = options.enableAnimation === 'true';

    // Parse the fieldColorMap JSON string
    const fieldColorMap = JSON.parse(options.fieldColorMap || '{}');

    const pieData = parsed.xValues.map((name, index) => {
      const color = fieldColorMap[name];
      return {
        name,
        value: parsed.yValues[index],
        itemStyle: color ? { color } : undefined,
      };
    });

    const option: echarts.EChartsOption = {
      title: {
        text: options.title || `${parsed.xFieldName} vs ${parsed.yFieldName}`,
        left: 'center',
        textStyle: {
          fontSize: options.fontSize || 16,
          fontWeight: options.fontWeight || 'normal',
          color: options.titleColor || '#333',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const format = options.tooltipFormat || '{b}: {c} ({d}%)';
          return format
            .replace('{b}', params.name)
            .replace('{c}', params.value)
            .replace('{d}', params.percent?.toFixed(2) || '0');
        },
      },
      
      toolbox: {
        show: showLegend,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        show: showLegend,
        left: 'center',
        top: 'bottom',
        data: parsed.xValues,
      },
      series: [
        {
          name: parsed.yFieldName,
          type: 'pie',
          radius: [`${options.innerRadius}%`, `${options.outerRadius}%`],
          center: ['50%', '50%'],
          roseType: options.roseType,
          itemStyle: {
            borderRadius: 5,
          },
          label: {
            show: showLegend,
            color: options.labelFontColor || 'white',
            fontSize: options.labelFontSize || 12,
            fontWeight: options.fontWeight,
            position: options.labelPosition || 'outside',
          },
          emphasis: {
            label: {
              show: showLegend,
              fontWeight: options.fontWeight,
            },
          },
          data: pieData,
        },
      ],
      animation: enableAnimation, // Enable animation based on user input
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [data, width, height, options]);

  return <main>
<div ref={chartRef} style={{ width, height }}>

  </div>
  <Button>Top 10 values</Button>
  <Modal title="title" isOpen={false}>
  <div>Some body</div>
  <Modal.ButtonRow>
    <Button variant="secondary" fill="outline">
      Cancel
    </Button>
    <Button>Save</Button>
  </Modal.ButtonRow>
</Modal>
  </main> 
  
};


