import * as React from 'react';
import './App.css';

import {Col, Row, Table} from 'antd';
import {ChangeEvent} from "react";
import {FileInput} from "./components/FileInput";
import {ICsvEntity} from "./types/ICsvEntity";
import {csvColumns, parseN26Csv} from "./util/CsvUtil";

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

        this.onInputChange = this.onInputChange.bind(this);
    }

    public render() {
        return (
            <div className="tableWrapper">
                <Row gutter={16}
                     justify="center"
                     style={{
                         marginBottom: '5px',
                         marginLeft: '3px',
                         marginTop: '5px',
                     }}>
                    <Col span={4}>
                        <FileInput onChange={this.onInputChange}/>
                    </Col>
                </Row>
                <Row gutter={16} justify="center">
                    <Col span={24}>
                        <Table
                            columns={csvColumns}
                            dataSource={this.state.data}
                            pagination={false}
                            scroll={{ y: 600 }}
                            size="middle"
                        />
                    </Col>
                </Row>
            </div>
        );
    }

    private onInputChange(event: ChangeEvent) {
        if (event.target == null) {
            // Bail out on null
            return;
        }

        // @ts-ignore
        const file = event.target.files[0];
        if (!file) {
            // No file selected
            return;
        }

        const reader = new FileReader();
        reader.onload = _ => {
            if (reader.result && typeof reader.result === 'string') {
                this.setState({
                    data: parseN26Csv(reader.result),
                });
            }
        };
        reader.readAsText(file);
    }
}

export default App;
