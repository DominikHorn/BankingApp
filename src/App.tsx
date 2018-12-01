import {Alert, Card, Carousel} from "antd";
import * as React from 'react';
import './App.css';
import {BankStatementTable} from "./components/BankStatementTable";
import {AccountBalancePlot, IAccountBalancePlotDataPoint} from "./components/plots/AccountBalancePlot";
import {OriginPlot} from "./components/plots/OriginPlot";
import {ICsvEntity} from "./types/ICsvEntity";
import {Money} from "./types/Money";

export interface IAppProps {
    appname: string;
}

interface IAppState {
    data: ICsvEntity[];
    accountPlotData: IAccountBalancePlotDataPoint[];
}

class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            accountPlotData: [],
            data: [],
        };

        // Make this keyword refer to app instance in handler code
        this.handleBankStatementTableChange = this.handleBankStatementTableChange.bind(this);
    }

    /** Rendering code */
    public render() {
        return (
            <div>
                {this.state.accountPlotData && this.state.accountPlotData.length > 0 ?
                    <Carousel className="Carousel">
                        <AccountBalancePlot
                            data={this.state.accountPlotData}/>
                        <OriginPlot/>
                    </Carousel>
                    : this.renderNoData()
                }
                <BankStatementTable
                    data={this.state.data}
                    onChange={this.handleBankStatementTableChange}/>
            </div>);
    }

    /** Rendering code when no data exists */
    private renderNoData() {
        return (
            <Card className="InfoCard">
                <Alert message="Es sind keine Plotbaren Daten vorhanden" type="warning"/>
            </Card>
        );
    }

    /** Event handeling */
    private handleBankStatementTableChange(newData: ICsvEntity[]) {
        let previousBalance = new Money(0);
        const accountPlotData: IAccountBalancePlotDataPoint[] = newData.map((dp, index) => {
            // Update previous balanceRepr for next iteration
            previousBalance = Money.add(previousBalance, dp.amount);

            return {
                balance: previousBalance,
                date: dp.date,
            };
        });

        this.setState({
            accountPlotData,
            data: newData,
        });
    }
}

export default App;
