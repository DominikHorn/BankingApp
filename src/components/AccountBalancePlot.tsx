import * as React from 'react';
import {Line} from "react-chartjs-2";
import './AccountBalancePlot.css';

export interface IAccountBalancePlotProps {
    data: IAccountPlotDataPoint[];
}

export interface IAccountPlotDataPoint {
    label: string;
    value: number;
}

export class AccountBalancePlot extends React.Component<IAccountBalancePlotProps, any> {
    public render() {
        // TODO: don't recalc this in render every time, instead only on props change
        const data = {
            datasets: [
                {
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderCapStyle: 'butt',
                    borderColor: 'rgba(75,192,192,1)',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    data: this.props.data.map(d => d.value),
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
            labels: this.props.data.map(d => d.label),
        };
        const options = {
            maintainAspectRatio: false,
        };


        // TODO: correct this!!!
        // @ts-ignore type definitions are wrong
        return <Line data={data}
                     className="linePlot"
                     height={100}
                     options={options}
        />;
    }
}