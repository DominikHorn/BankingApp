import * as React from 'react';
import './App.css';
import {AccountBalancePlot, IAccountPlotDataPoint} from "./components/AccountBalancePlot";
import {BankStatementTable} from "./components/BankStatementTable";
import {ICsvEntity} from "./types/ICsvEntity";
import {Money} from "./types/Money";

export interface IAppProps {
    appname: string;
}

interface IAppState {
    data: ICsvEntity[];
    accountPlotData: IAccountPlotDataPoint[];
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
                <AccountBalancePlot
                    data={this.state.accountPlotData}/>
                <BankStatementTable
                    data={this.state.data}
                    onChange={this.handleBankStatementTableChange}/>
            </div>);
    }

    /** Event handeling */
    private handleBankStatementTableChange(newData: ICsvEntity[]) {
        let previousBalance = new Money(0);
        const accountPlotData: IAccountPlotDataPoint[] = newData.map(dp => {
            // Update previous balance for next iteration
            previousBalance = Money.add(previousBalance, dp.amount);
            return {
                label: dp.date.toLocaleString(),
                value: previousBalance.toString(),
            };
        });

        this.setState({
            accountPlotData,
            data: newData,
        });
    }
}

export default App;
