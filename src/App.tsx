import * as React from 'react';
import './App.css';
import {AccountBalancePlot, IAccountPlotDataPoint} from "./components/AccountBalancePlot";
import {BankStatementTable} from "./components/BankStatementTable";
import {ICsvEntity} from "./types/ICsvEntity";

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
        let balance = 0;
        const accountPlotData: IAccountPlotDataPoint[] = newData.map(dp => {
            balance = balance + (dp.amount ? dp.amount : 0);
            return {
                label: dp.date.toLocaleString(),
                value: balance,
            };
        });

        this.setState({
            accountPlotData,
            data: newData,
        });
    }
}

export default App;
