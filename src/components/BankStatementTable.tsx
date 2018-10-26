import {Col, Row, Table} from "antd";
import * as React from 'react';
import {ChangeEvent} from "react";
import {ICsvEntity} from "../types/ICsvEntity";
import {csvColumns, parseN26Csv} from "../util/CsvUtil";
import './BankStatementTable.css';
import {FileInput} from "./FileInput";

export interface IBankStatementProps {
    data: ICsvEntity[];
    onChange: (newData: ICsvEntity[]) => void;
}

export class BankStatementTable extends React.Component<IBankStatementProps, any> {
    constructor(props: IBankStatementProps) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
    }

    public renderTableHeader() {
        return (
            <Row gutter={16}
                 justify="center"
                 style={{
                     marginBottom: '5px',
                     marginLeft: '1px',
                     marginTop: '5px',
                 }}>
                <Col span={4}>
                    <FileInput onChange={this.onInputChange}/>
                </Col>
            </Row>);
    }

    public renderTableBody() {
        return (
            <Row gutter={16} justify="center">
                <Col span={24}>
                    <Table
                        columns={csvColumns}
                        dataSource={this.props.data}
                        pagination={false}
                        scroll={{y: 500}}
                        size="middle"
                    />
                </Col>
            </Row>);
    }

    public render() {
        return (
            <div className="tableWrapper">
                {this.renderTableHeader()}
                {this.renderTableBody()}
            </div>);
    }


    /** Event handling code */

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
                this.props.onChange(parseN26Csv(reader.result));
            }
        };
        reader.readAsText(file);
    }
}