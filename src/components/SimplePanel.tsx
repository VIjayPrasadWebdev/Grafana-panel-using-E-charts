// import React from 'react';
// import { PanelProps } from '@grafana/data';
// import { SimpleOptions } from 'types';
// import { css, cx } from '@emotion/css';
// import { Button, useStyles2, useTheme2 } from '@grafana/ui';
// import { PanelDataErrorView } from '@grafana/runtime';

// interface Props extends PanelProps<SimpleOptions> {}

// const getStyles = () => {
//   return {
//     wrapper: css`
//       font-family: Open Sans;
//       position: relative;
//     `,
//     svg: css`
//       position: absolute;
//       top: 0;
//       left: 0;
//     `,
//     textBox: css`
//       position: absolute;
//       bottom: 0;
//       left: 0;
//       padding: 10px;
//     `,
//   };
// };

// export const SimplePanel: React.FC<Props> = ({ options, data, width, height, fieldConfig, id }) => {
//   console.log("grafana data",data);
//   console.log("other details",fieldConfig,id);
  
//   console.log("options",options);
//   console.log("styles",useStyles2(getStyles));
  
  
//   const theme = useTheme2();
//   const styles = useStyles2(getStyles);

//   if (data.series.length === 0) {
//     return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} needsStringField />;
//   }

//   return (
//     <div
//       className={cx(
//         styles.wrapper,
//         css`
//           width: ${width}px;
//           height: ${height}px;
//         `
//       )}
//     >
//       <Button>Example</Button>
//      {/*   <svg
//         className={styles.svg}
//         width={width}
//         height={height}
//         xmlns="http://www.w3.org/2000/svg"
//         xmlnsXlink="http://www.w3.org/1999/xlink"
//         viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
//       >
//         <g>
//           <circle data-testid="simple-panel-circle" style={{ fill: theme.colors.primary.main }} r={100} />
//         </g>
//       </svg>   */}

//       <div className={styles.textBox}>
//         {options.showSeriesCount && (
//           <div data-testid="simple-panel-series-counter">Number of series: {data.series.length}</div>
//         )}
//         <div>Text option value: {options.text}</div>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import * as echarts from 'echarts';
import { getChartDataFromFrame } from '../chartDataParser';
import { SimpleOptions } from '../types';

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

    // Build Nightingale-style pie data
    const pieData = parsed.xValues.map((name, index) => ({
      name,
      value: parsed.yValues[index],
    }));

    const option: echarts.EChartsOption = {
      title: {
        text: options.title || `${parsed.xFieldName} vs ${parsed.yFieldName}`,
        left: 'center',
        textStyle: {
          fontSize: options.fontSize || 16,
          fontWeight: options.fontWeight || 'normal',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        left: 'center',
        top: 'bottom',
        data: parsed.xValues,
      },
      series: [
        {
          name: parsed.yFieldName,
          type: 'pie',
          radius: [20, 140],
          center: ['50%', '50%'],
          roseType: 'radius',
          itemStyle: {
            borderRadius: 5,
            color: options.colorScheme,
          },
          label: {
            show: true,
            color: 'white',
            fontSize: options.fontSize || 16,
            fontWeight: options.fontWeight,
          },
          emphasis: {
            label: {
              show: true,
            },
          },
          data: pieData,
        },
      ],
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [data, width, height, options]);

  return <div ref={chartRef} style={{ width, height }} />;
};
