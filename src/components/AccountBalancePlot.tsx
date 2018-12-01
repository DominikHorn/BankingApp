import {Alert, Card} from "antd";
import memoize from 'memoize-one';
import * as React from 'react';
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {Money} from "../types/Money";
import {calculateTrendLine} from "../util/MathUtil";
import './AccountBalancePlot.css';

export interface IAccountBalancePlotProps {
    data: IAccountBalancePlotDataPoint[];
}

export interface IAccountBalancePlotDataPoint {
    balance: Money,
    date: Date,
}

export class AccountBalancePlot extends React.Component<IAccountBalancePlotProps, any> {
    /* Use Memoization to avoid always recalculating this data */
    private processedData = memoize(
        (data: IAccountBalancePlotDataPoint[]) => {
            // Calculate Trend line
            const trendLine = calculateTrendLine(
                data.map((dp, index) => ({x: index + 1, y: dp.balance.value()})));

            // Map correct trend cords to each point
            return data.map((dp, index) => {
                // Date for x axis label
                const dd = dp.date.getDate();
                const mm = dp.date.getMonth() + 1;
                const yyyy = dp.date.getFullYear();

                // Extrapolate trend line according to equation
                const trendLineY = trendLine.slope * index + trendLine.yOffset;

                // Package into neat object
                return {
                    balance: dp.balance.valueString(),
                    dateRepr: `${dd < 10 ? `0${dd}` : dd}.${mm < 10 ? `0${mm}` : mm}.${yyyy}`,
                    trendLineY,
                };
            });
        }
    );

    /* This code stems from a rechart example: http://recharts.org/en-US/examples/AreaChartFillByValue */
    private gradientOffset = memoize(
        (data: IAccountBalancePlotDataPoint[]) => {
            const dataMax = Math.max(...data.map((i) => i.balance.value()));
            const dataMin = Math.min(...data.map((i) => i.balance.value()));

            if (dataMax <= 0) {
                return 0
            }
            else if (dataMin >= 0) {
                return 1
            }
            else {
                return dataMax / (dataMax - dataMin);
            }
        }
    );


    public render() {
        // TODO: vary plot height based on devices
        // TODO: use unified measures for margin (1em instead of '20' f.e.)
        return this.props.data.length > 0 ? this.renderGraph() : this.renderNoData();
    }

    private renderGraph() {
        const processedData = this.processedData(this.props.data);
        const gradientOff = this.gradientOffset(this.props.data);

        return (
            <ResponsiveContainer
                width={"100%"}
                height={500}
            >
                <ComposedChart
                    data={processedData}
                    margin={{top: 20, right: 50, bottom: 40}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="dateRepr" tick={{angle: 45, textAnchor: "start"}}/>
                    <YAxis/>
                    <Tooltip/>
                    <defs>
                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset={gradientOff} stopColor="green" stopOpacity={1}/>
                            <stop offset={gradientOff} stopColor="red" stopOpacity={1}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="balance" fill="url(#splitColor)" unit="€"/>
                    <Line type="linear" dataKey="trendLineY" stroke="#000" dot={false} unit="€"/>
                </ComposedChart>
            </ResponsiveContainer>
        );
    }

    private renderNoData() {
        return (
            <Card className="InfoCard">
                <Alert message="Es sind keine Plotbaren Daten vorhanden" type="warning"/>
            </Card>
        );
    }
}