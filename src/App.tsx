import * as React from 'react';
import './App.css';
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
            <BankStatementTable
                data={this.state.data}
                onChange={this.handleBankStatementTableChange}/>);
    }

    /** Event handeling */
    private handleBankStatementTableChange(newData: ICsvEntity[]) {
        this.setState({
            data: newData,
        });
    }
}

export default App;
