import memoize from "memoize-one";
import * as React from 'react';
import {Line} from "react-chartjs-2";
import './AccountBalancePlot.css';

export interface IAccountBalancePlotProps {
    data: IAccountPlotDataPoint[];
}

export interface IAccountPlotDataPoint {
    label: string;
    value: string;
}

export class AccountBalancePlot extends React.Component<IAccountBalancePlotProps, any> {
    /** Memoized linechart data. This prevents unnecessary recalcs */
    private lineChartData = memoize(
        (dat: IAccountPlotDataPoint[]) => ({
            datasets: [
                {
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderCapStyle: 'butt',
                    borderColor: 'rgba(75,192,192,1)',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    data: dat.map(d => d.value),
                    fill: false,
                    label: 'Account Balance',
                    lineTension: 0.1,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBorderWidth: 1,
                    pointHitRadius: 10,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointHoverRadius: 5,
                    pointRadius: 1,
                }
            ],
            labels: dat.map(d => d.label)
        }));

    public render() {
        const lineChartData = this.lineChartData(this.props.data);

        // TODO: correct this!!!
        // @ts-ignore type definitions are wrong
        return <Line data={lineChartData}
                     className="linePlot"
                     height={100}
            // options={{
            //     maintainAspectRatio: false,
            // }}
        />;
    }
}