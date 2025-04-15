import { DataFrame } from '@grafana/data';
import { SimpleOptions } from 'types';
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
  