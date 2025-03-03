import { ChartOptions } from "chart.js";
import React, { ReactElement } from "react";
import { Chart, ChartProps } from "./Charts";
import ChartDataLabels from 'chartjs-plugin-datalabels';

export interface LineChartProps extends Omit<ChartProps, "renderChart"> {
    showThresholds?: boolean
    minimal?: boolean;
    minHeight?: number;
    maxHeight?: number;
    range?: { min: number, max: number }
    renderChart: (options: ChartOptions<any>, data: any, plugins: any) =>  ReactElement

}

export const LineChart = (props: LineChartProps) => {

    const displayName = LineChart.name;
    const defaultProps = {
        dateToString: (date: Date) => date.toLocaleDateString()
    }

    //const dateHelper!: IDateHelper

    const renderGraph = (data: { labels: (string | undefined)[], datasets: {} }): JSX.Element => {
        //Remove all the legends for the thresholdvalues (since we are only interested in the question being a legend)
        const options: ChartOptions<any> = {
            maintainAspectRatio: false,
            scales: {
                y: {
                    offset: true,
                    ticks: {
                        display: !props.minimal
                    },
                    grid: {
                        display: !props.minimal,

                    },
                    suggestedMin: props.range?.min,
                    suggestedMax: props.range?.max,
                },
                x: {
                    ticks: {
                        display: !props.minimal,
                        autoSkip: true,
                        maxRotation: 90,
                        minRotation: 90
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: props.chartData.getThresholdDatasets(props.showThresholds ?? true) // <- Defaults to true
                },
                legend: {
                    labels: {
                        filter: function (item: { text: string }) {
                            return false
                        }
                    }
                }
            }
        }
        let plugins: any[] = []
        if (!props.minimal) {
            plugins = [ChartDataLabels as any]
        }

         //return (<Line style={{ minHeight: props.minHeight, maxHeight: props.maxHeight }} plugins={plugins} options={options} data={data as any} />)
        return (props.renderChart(options, data, plugins))

    }


    return (
        <Chart
            chartData={props.chartData}
            renderChart={(data) => {

                let answerData = data.answerData
                let answerLabels = data.answerLabels

                const dataSets = []; //Each entry represents one line in the chart

                dataSets.push(data.getDataDatasets(props.minimal??false))

                const x = {
                    labels: answerLabels,
                    datasets: dataSets,
                };

                return (<>{renderGraph(x)}</>);
            }}
        />
    )
}

LineChart.defaultProps = {
    minimal: false,
    showThresholds: true,
    dateToString: (date: Date) => date.toLocaleDateString(),
    minHeight: "400px",
    maxHeight: "600px"
  }
