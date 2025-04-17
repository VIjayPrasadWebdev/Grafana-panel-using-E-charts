import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';


import SemiDonut from './SemiDonut';
import Nightingale from './Nightingale';
import CustomChart from './CustomChart';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = (data) => {
  let {options}=data
  switch (options.chartType) {
    case 'Nightingale':
      return <Nightingale {...data}  />;
    case 'SemiDonut':
      return <SemiDonut  {...data}  />;
    case 'customChart':
      return <CustomChart/>
    default:
      return <div>Unsupported chart type selected</div>;
  }
};
