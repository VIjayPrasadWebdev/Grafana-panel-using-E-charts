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
  titleColor:any,
  fieldColor:any,
  fontSize:number,
  colorScheme:any,
  fontWeight: any,
  changeRadiussize:any,
  innerRadius:number,
  outerRadius:number,
  roseType:any,
  showLegend:any,
  tooltipFormat:any,
  labelFontColor:any,
  labelFontSize:any,
  labelPosition:any,
  enableAnimation:any,
  labelFontWeight:any
  fieldColorMap?: any; 
}