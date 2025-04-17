import React, { useEffect, useRef, useState } from 'react';
import { PanelProps } from '@grafana/data';
import * as echarts from 'echarts';
import { SimpleOptions } from 'types';
import { getChartDataFromFrame } from '../chartDataParser';
import { Button, Modal } from '@grafana/ui';

interface Props extends PanelProps<SimpleOptions> {}

const SemiDonut: React.FC<Props> = ({ data, width, height, options }) => {
  const [openModal, setOpenModal] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const series = data.series[0];
  const fields = series.fields;

  const numRows = fields[0].values.length;
  const rows = Array.from({ length: numRows }, (_, rowIndex) =>
    fields.map(field => field.values.get(rowIndex))
  );

  useEffect(() => {
    if (!chartRef.current || data.series.length === 0) return;

    const chart = echarts.init(chartRef.current);
    const parsed = getChartDataFromFrame(data.series[0], options);

    if (!parsed.valid) {
      chart.setOption({
        title: { text: parsed.message || 'Invalid data' },
      });
      return;
    }

    const showLegend = options.showLegend === 'true';
    const enableAnimation = options.enableAnimation === 'true';
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
          startAngle: 180,
          endAngle: 360,
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
     
      animation: enableAnimation,
    };

    chart.setOption(option);
    return () => chart.dispose();
  }, [data, width, height, options]);

  return (
    <div>
      <div ref={chartRef} style={{ width, height }} />

      <Button onClick={() => setOpenModal(true)} style={{ marginTop: '1rem' }}>
        Get the data
      </Button>

      <Modal title="Grafana Metrics Data" isOpen={openModal} onDismiss={() => setOpenModal(false)}>
        <div>
          <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '1px solid #ccc', padding: '8px 0' }}>
            {fields.map((field, i) => (
              <div key={i} style={{ flex: 1 }}>{field.name}</div>
            ))}
          </div>

          {rows.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', padding: '6px 0', borderBottom: '1px solid #eee' }}>
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} style={{ flex: 1 }}>{String(cell)}</div>
              ))}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SemiDonut;
