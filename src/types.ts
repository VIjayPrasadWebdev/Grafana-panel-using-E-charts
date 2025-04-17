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
  titleColor:string,
  fieldColor:string,
  fontSize:number,
  colorScheme:string,
  fontWeight: any,
  changeRadiussize:any,
  innerRadius:number,
  outerRadius:number,
  roseType:any,
  showLegend:any,
  tooltipFormat:string,
  labelFontColor:string,
  labelFontSize:string,
  labelPosition:string[],
  enableAnimation:string,
  labelFontWeight:string,
  fieldColorMap?: any; 
}