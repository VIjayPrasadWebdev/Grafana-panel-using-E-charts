type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
  xFieldName: string;
  yFieldName: string;
  xValues: any[];
  yValues: any[];
  xField:any,
  yField:any,
  valid: boolean;
  message?: string;
  title:string,
  fontSize:number,
  colorScheme:any,
  fontWeight: any,
}