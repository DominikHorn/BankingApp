import memoize from 'memoize-one';
import * as React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {ICsvEntity} from "../../types/ICsvEntity";
import {Money} from "../../types/Money";

export interface IOriginPlotProps {
    transactionData: ICsvEntity[],
}

export class OriginPlot extends React.PureComponent<IOriginPlotProps, any> {
    /** Data for this plot */
    private plotData = memoize(
        (transactionData: ICsvEntity[]) => {
            const map = {};
            for (const entity of transactionData) {
                const current = map[entity.payee] ? map[entity.payee] : new Money();
                map[entity.payee] = Money.add(current, entity.amount);
            }

            const result = [];
            // TODO rewrite code to avoid this for ... in ...
            // tslint:disable-next-line
            for (const payee in map) {
                result.push({payee, value: map[payee].value()});
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

    public render() {
        const plotData = this.plotData(this.props.transactionData);

        return (
            <ResponsiveContainer
                width={"100%"}
                height={500}
            >
                <BarChart
                    data={plotData}
                    margin={{top: 20, right: 50, bottom: 40}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="payee"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <ReferenceLine y={0} stroke='#000'/>
                    <Bar dataKey="value" fill="#8884d8"/>
                </BarChart>
            </ResponsiveContainer>
        );
    }
}