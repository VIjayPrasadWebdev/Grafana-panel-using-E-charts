import { PanelPlugin,DataFrame } from '@grafana/data';
import { SimplePanel } from './components/SimplePanel';
import { SimpleOptions } from './types';


export interface ParsedChartData {
  xFieldName: string;
  yFieldName: string;
  xValues: any[];
  yValues: any[];
  valid: boolean;
  message?: string;
}

// Function to extract chart data from the DataFrame based on selected fields
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

  return {
    xFieldName: xField.name,
    yFieldName: yField.name,
    xValues: xField.values.toArray(),
    yValues: yField.values.toArray(),
    valid: true,
  };
}

// Register panel plugin and custom options
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
    .addColorPicker({
      path: 'colorScheme',
      name: 'Base Color',
      description: 'Base color for the slices (will rotate through tones).',
      defaultValue: '#ff6347',
    })
    .addNumberInput({
      path: 'fontSize',
      name: 'Font Size',
      description: 'Font size for the chart title.',
      defaultValue: 16,
      settings: {
        min: 10,
        max: 40,
        step: 1,
      },
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
    });
});
