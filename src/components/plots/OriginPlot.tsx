import * as React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, ReferenceLine, Tooltip, XAxis, YAxis} from "recharts";

export class OriginPlot extends React.Component<any, any> {
    public render() {
        return (
            <BarChart width={600} height={300} data={this.props.data}
                      margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend />
                <ReferenceLine y={0} stroke='#000'/>
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
        );
    }
}