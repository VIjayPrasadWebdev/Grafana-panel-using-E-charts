import { PanelPlugin, DataFrame } from '@grafana/data';
import { SimplePanel } from './components/SimplePanel';
import { SimpleOptions } from './types';

export interface ParsedChartData {
  xFieldName: string;
  yFieldName: string;
  xValues: any[];
  yValues: any[];
  valid: boolean;
  message?: string;
  allFieldNames?: string[]; // for Sankey
  rows?: any[][];           // for Sankey
}

export function getChartDataFromFrame(series: DataFrame, options: SimpleOptions): ParsedChartData {
  if (series.fields.length < 2) {
    return {
      xFieldName: '',
      yFieldName: '',
      xValues: [],
      yValues: [],
      valid: false,
      message: 'Not enough fields in the data.',
    };
  }

  const xField = series.fields.find((field) => field.name === options.xField) || series.fields[0];
  const yField = series.fields.find((field) => field.name === options.yField) || series.fields[1];

  const xValues = xField.values.toArray();
  const yValues = yField.values.toArray();

  // For Sankey (collect all fields as row-wise data)
  const allFieldNames = series.fields.map((f) => f.name);
  const rowCount = series.fields[0].values.length;
  const rows = Array.from({ length: rowCount }, (_, i) =>
    series.fields.map((f) => f.values.get(i))
  );

  return {
    xFieldName: xField.name,
    yFieldName: yField.name,
    xValues,
    yValues,
    valid: true,
    allFieldNames,
    rows,
  };
}

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'xField',
      name: 'X-Axis Field',
      description: 'Field for the pie labels (X-axis).',
      defaultValue: 'Site',
    })
    .addTextInput({
      path: 'yField',
      name: 'Y-Axis Field',
      description: 'Field for the pie values (Y-axis).',
      defaultValue: 'Count',
    })
    .addTextInput({
      path: 'title',
      name: 'Chart Title',
      description: 'Set the title of the chart.',
      defaultValue: '',
    })
    .addNumberInput({
      path: 'fontSize',
      name: 'Font Size',
      description: 'Font size for the chart title.',
      defaultValue: 16,
      settings: { min: 10, max: 40, step: 1 },
    })
    .addRadio({
      path: 'fontWeight',
      name: 'Font Weight',
      description: 'Font weight for the chart title.',
      defaultValue: 'normal',
      settings: {
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'bold', label: 'Bold' },
          { value: 'lighter', label: 'Lighter' },
        ],
      },
    })
    .addTextInput({
      path: 'titleColor',
      name: 'Title Color',
      description: 'Hex or named color for the chart title.',
      defaultValue: '#333',
    })
    .addTextInput({
      path: 'fieldColor',
      name: 'Field Color',
      description: 'Global color override for the chart segments.',
      defaultValue: 'white',
    })
    .addTextInput({
      path: 'fieldColorMap',
      name: 'Field Color Map (JSON)',
      description: 'JSON map like {"Site A": "#FF0000", "Site B": "#00FF00"}',
      defaultValue: '{}',
    })
    .addNumberInput({
      path: 'innerRadius',
      name: 'Inner Radius (%)',
      description: 'Inner radius as percentage of chart size',
      defaultValue: 25,
      settings: { min: 0 },
    })
    .addNumberInput({
      path: 'outerRadius',
      name: 'Outer Radius (%)',
      description: 'Outer radius as percentage of chart size',
      defaultValue: 100,
      settings: { min: 0 },
    })
    .addRadio({
      path: 'roseType',
      name: 'Rose Chart Type',
      description: 'Choose rose-type pie mode: area or radius.',
      defaultValue: 'radius',
      settings: {
        options: [
          { label: 'Radius', value: 'radius' },
          { label: 'Area', value: 'area' },
        ],
      },
    })
    .addRadio({
      path: 'showLegend',
      name: 'Show Legend',
      description: 'Toggle to show or hide chart legend.',
      defaultValue: 'true',
      settings: {
        options: [
          { label: 'Show', value: 'true' },
          { label: 'Hide', value: 'false' },
        ],
      },
    })
    .addTextInput({
      path: 'tooltipFormat',
      name: 'Tooltip Format',
      description: 'Format string for tooltip, e.g., "{b}: {c} ({d}%)"',
      defaultValue: '{b}: {c} ({d}%)',
    })
    .addTextInput({
      path: 'labelFontColor',
      name: 'Label Font Color',
      description: 'Hex or named color for labels.',
      defaultValue: 'white',
    })
    .addNumberInput({
      path: 'labelFontSize',
      name: 'Label Font Size',
      description: 'Font size of data labels.',
      defaultValue: 12,
      settings: { min: 8, max: 24 },
    })
    .addRadio({
      path: 'labelPosition',
      name: 'Label Position',
      description: 'Position of labels on chart slices.',
      defaultValue: 'outside',
      settings: {
        options: [
          { label: 'Inside', value: 'inside' },
          { label: 'Outside', value: 'outside' },
          { label: 'Center', value: 'center' },
        ],
      },
    })
    .addRadio({
      path: 'enableAnimation',
      name: 'Enable Animation',
      description: 'Toggle chart entry animation.',
      defaultValue: 'true',
      settings: {
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    })
    .addRadio({
      path: 'chartType',
      name: 'Chart Type',
      description: 'Choose which chart to display',
      defaultValue: 'Nightingale',
      settings: {
        options: [
          { label: 'Nightingale', value: 'Nightingale' },
          { label: 'SemiDonut', value: 'SemiDonut' },
          { label: 'customChart', value: 'customChart' },
        ],
      },
    });
});
