import {Alert, Card} from "antd";
import * as React from 'react';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import './AccountBalancePlot.css';

export interface IAccountBalancePlotProps {
    data: IAccountPlotDataPoint[];
}

export interface IAccountPlotDataPoint {
    balance: string;
    date: string;
}

export class AccountBalancePlot extends React.Component<IAccountBalancePlotProps, any> {
    public render() {
        // TODO: vary plot height based on devices
        // TODO: use unified measures for margin (1em instead of '20' f.e.)
        return this.props.data.length > 0 ? (
            <ResponsiveContainer
                width={"100%"}
                height={400}
            >
                <LineChart data={this.props.data} margin={{top: 20, right: 50, bottom: 40}}>
                    <Line type="monotone" dataKey="balance" stroke="#8884d8"/>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                    <XAxis dataKey="date" tick={{angle: 45, textAnchor: "start"}}/>
                    <YAxis/>
                    <Tooltip/>
                </LineChart>
            </ResponsiveContainer>
        ) : (
            <Card className="InfoCard">
                <Alert message="Keine plotbaren Daten" type="warning"/>
            </Card>
        );
    }
}