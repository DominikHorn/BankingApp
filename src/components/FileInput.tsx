import {Icon} from "antd";
import * as React from "react";
import {ChangeEvent} from "react";
import './FileInput.css';

export interface IFileInputProps {
    onChange: (e: ChangeEvent) => void;
}

export class FileInput extends React.Component<IFileInputProps, any> {
    public render() {
        return <div>
            <input
                type="file"
                name="file"
                id="file"
                className="inputfile"
                onChange={this.props.onChange}
            />
            <label htmlFor="file">
                <Icon type="upload"/>
                {' Choose a file'}
            </label>
        </div>;
    }
}