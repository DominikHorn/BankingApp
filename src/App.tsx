import {Alert, Card, Carousel} from "antd";
import * as React from 'react';
import './App.css';
import {BankStatementTable} from "./components/BankStatementTable";
import {AccountBalancePlot} from "./components/plots/AccountBalancePlot";
import {OriginPlot} from "./components/plots/OriginPlot";
import {ICsvEntity} from "./types/ICsvEntity";

export interface IAppProps {
    appname: string;
}

interface IAppState {
    transactionData: ICsvEntity[];
}

class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            transactionData: [],
        };

        // Make this keyword refer to app instance in handler code
        this.handleBankStatementTableChange = this.handleBankStatementTableChange.bind(this);
    }

    /** Rendering code */
    public render() {
        return (
            <div>
                {this.state.transactionData && this.state.transactionData.length > 0 ?
                    <Carousel className="Carousel">
                        <AccountBalancePlot
                            transactionData={this.state.transactionData}/>
                        <OriginPlot/>
                    </Carousel>
                    : this.renderNoData()
                }
                <BankStatementTable
                    data={this.state.transactionData}
                    onChange={this.handleBankStatementTableChange}/>
            </div>);
    }

    /** Rendering code when no transactionData exists */
    private renderNoData() {
        return (
            <Card className="InfoCard">
                <Alert message="Es sind keine Plotbaren Daten vorhanden" type="warning"/>
            </Card>
        );
    }

    /** Event handeling */
    private handleBankStatementTableChange(newData: ICsvEntity[]) {
        this.setState({
            transactionData: newData,
        });
    }
}

export default App;
