import React, { useEffect, useRef, useState } from 'react';
import { PanelProps } from '@grafana/data';
import * as echarts from 'echarts';
import { SimpleOptions } from 'types';
import { getChartDataFromFrame } from '../chartDataParser';
import { Button, Modal } from '@grafana/ui';

interface Props extends PanelProps<SimpleOptions> {}

const Nightingale: React.FC<Props> = ({ data, width, height, options }) => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

    // Toggle between dark and light mode
    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

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
                    color: isDarkMode ? '#fff' : '#333',  // Adjust title color based on theme
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
                backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)', // Adjust tooltip background color
                borderColor: isDarkMode ? '#444' : '#ddd', // Adjust tooltip border color
                textStyle: {
                    color: isDarkMode ? '#fff' : '#333', // Adjust tooltip text color
                }
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
                textStyle: {
                    color: isDarkMode ? '#fff' : '#333', // Adjust legend text color
                },
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
                        color: isDarkMode ? '#fff' : '#333', // Adjust label color based on theme
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
            backgroundColor: isDarkMode ? 'black' : '#fff', // Set background color based on theme
        };

        chart.setOption(option);
        return () => chart.dispose();
    }, [data, width, height, options, isDarkMode]);  // Added isDarkMode to the dependency array

    return (
        <div>
            <div>
                <button onClick={toggleTheme}>
                    Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
                </button>
                <div ref={chartRef} style={{ width, height }} />
            </div>

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

export default Nightingale;
