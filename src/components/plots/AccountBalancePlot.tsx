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
import {ICsvEntity} from "../../types/ICsvEntity";
import {Money} from "../../types/Money";
import {calculateTrendLine} from "../../util/MathUtil";

export interface IAccountBalancePlotProps {
    transactionData: ICsvEntity[];
}

interface IAccountBalancePlotDataPoint {
    balance: Money,
    date: Date,
}

export class AccountBalancePlot extends React.PureComponent<IAccountBalancePlotProps, any> {
    /**  Account balance based on transaction Data */
    private balanceData = memoize(
        (transactionData: ICsvEntity[]) => {
            // Find account balance based on transaction Data
            let previousBalance = new Money(0);
            return transactionData.map(dp => {
                // Update previous balanceRepr for next iteration
                previousBalance = Money.add(previousBalance, dp.amount);

                return {
                    balance: previousBalance,
                    date: dp.date,
                };
            });
        }
    )

    /** Use Memoization to avoid always recalculating this transactionData */
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
                    trendLineY: +trendLineY.toFixed(2),
                };
            });
        }
    );

    /** This code stems from a rechart example: http://recharts.org/en-US/examples/AreaChartFillByValue */
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
        const balanceData = this.balanceData(this.props.transactionData)
        const processedData = this.processedData(balanceData);
        const gradientOff = this.gradientOffset(balanceData);

        // TODO: vary plot height based on devices
        // TODO: use unified measures for margin (1em instead of '20' f.e.)
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
                    <Line type="linear" dataKey="trendLineY" stroke="#000" dot={false}/>
                </ComposedChart>
            </ResponsiveContainer>
        );
    }
}