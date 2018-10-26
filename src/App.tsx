import * as React from 'react';
import './App.css';
import {AccountBalancePlot} from "./components/AccountBalancePlot";
import {BankStatementTable} from "./components/BankStatementTable";
import {ICsvEntity} from "./types/ICsvEntity";

export interface IAppProps {
    appname: string;
}

interface IAppState {
    data: ICsvEntity[];
}

class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            data: [],
        };

        // Make this keyword refer to app instance in handler code
        this.handleBankStatementTableChange = this.handleBankStatementTableChange.bind(this);
    }

    /** Rendering code */
    public render() {
        return (
            <div>
                <AccountBalancePlot/>
                <BankStatementTable
                    data={this.state.data}
                    onChange={this.handleBankStatementTableChange}/>
            </div>);
    }

    /** Event handeling */
    private handleBankStatementTableChange(newData: ICsvEntity[]) {
        this.setState({
            data: newData,
        });
    }
}

export default App;
