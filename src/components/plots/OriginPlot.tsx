import memoize from 'memoize-one';
import * as React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid, Cell, Pie, PieChart, ReferenceLine,
    ResponsiveContainer,
    Tooltip, XAxis,
    YAxis
} from "recharts";
import {ICsvEntity} from "../../types/ICsvEntity";
import {Money} from "../../types/Money";
import './Plots.css'

export interface IOriginPlotProps {
    transactionData: ICsvEntity[],
}

// TODO: value should be Money
interface IOriginPlotBarDataPoint {
    payee: string;
    value: number;
    valuePos?: number;
    valueNeg?: number;
}

// TODO: value should be Money!
interface IOriginPlotPieDataPoint {
    name: string;
    value: number;
    color: string;
}

export class OriginPlot extends React.PureComponent<IOriginPlotProps, any> {
    /** Data for the bar plot */
    private barPlotData = memoize(
        (transactionData: ICsvEntity[]) => {
            const map = {};
            for (const entity of transactionData) {
                const current = map[entity.payee] ? map[entity.payee] : new Money();
                map[entity.payee] = Money.add(current, entity.amount);
            }

            const result: IOriginPlotBarDataPoint[] = [];
            // TODO rewrite code to avoid this for ... in ...
            // tslint:disable-next-line
            for (const payee in map) {
                const row: IOriginPlotBarDataPoint = {
                    payee,
                    value: map[payee].value(),
                };

                if (row.value === 0) {
                    continue;
                }
                if (row.value < 0) {
                    row.valueNeg = row.value;
                } else {
                    row.valuePos = row.value;
                }

                result.push(row);
            }

            // Sort based on value magnitude
            return result.sort((dp1, dp2) => {
                const dp1mag = dp1.value * dp1.value;
                const dp2mag = dp2.value * dp2.value;

                if (dp1mag < dp2mag) {
                    return 1;
                }
                if (dp2mag < dp1mag) {
                    return -2;
                }
                return 0;
            });
        }
    );

    /** Data for the pie plot */
    private piePlotData = memoize(
        (barPlotData: IOriginPlotBarDataPoint[]) => {
            // Take biggest x contributers, aggregate rest into 'other' category
            const aggrAfter = 5;
            const result: IOriginPlotPieDataPoint[] = barPlotData
                .slice(0, aggrAfter)
                .map(dp => ({
                    color: dp.valuePos ? '#00cc00' : '#ff6666',
                    name: dp.payee,
                    value: dp.value < 0 ? -dp.value : dp.value,
                }));

            if (barPlotData.length > aggrAfter) {
                const aggr = {name: 'Other', value: 0, color: "#AAAAAA"};
                for (let i = 7; i < barPlotData.length; i++) {
                    const val = barPlotData[i].value;
                    aggr.value += val > 0 ? val : -val;
                }
                aggr.value = parseFloat(aggr.value.toFixed(2));
                result.push(aggr);
            }


            return result;
        }
    );

    public render() {
        const barPlotData = this.barPlotData(this.props.transactionData);
        const piePlotData = this.piePlotData(barPlotData);

        // tslint:disable-next-line
        console.table(piePlotData);

        return (
            <div>
                <ResponsiveContainer
                    width={"75%"}
                    height={400}
                    className="InlineBlock"
                >
                    <BarChart
                        data={barPlotData}
                        margin={{top: 20, right: 50}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="payee"/>
                        <YAxis/>
                        <Tooltip/>
                        <ReferenceLine y={0} label="" stroke="#000"/>
                        <Bar dataKey="valuePos" fill="#00cc00" stackId="stack"/>
                        <Bar dataKey="valueNeg" fill="#ff6666" stackId="stack"/>
                    </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer
                    width={"25%"}
                    height={400}
                    className="InlineBlock"
                >
                    <PieChart
                        margin={{top: 20, right: 50}}
                    >
                        <Tooltip/>
                        <Pie
                            data={piePlotData}
                            dataKey="value"
                            fill="#8884d8"
                            label={true}
                            innerRadius={60}
                            outerRadius={100}
                        >
                            {piePlotData.map((dp) => <Cell key={dp.name} fill={dp.color}/>)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }
}