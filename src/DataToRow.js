import React, { Component } from "react";

import BooleanRow from "./BooleanRow";

class DataToRow extends Component {
    onClick = () => this.props.onUserSelected(this.props.data);

    dataToRow = () => {
        const DATA = this.props.data;
        const row = [];
        const PK = this.props.primaryKey;
        const DATES = ["date", "shortDate"];
        const ROW_CLASS_NAME =
            this.props.data[PK] === this.props.selected[PK]
                ? "rowSelected"
                : undefined;
        for (const property in DATA) {
            if ({}.hasOwnProperty.call(DATA, property)) {
                if (typeof this.props.data[property]["data"] === "boolean") {
                    row.push(
                        <td className={ROW_CLASS_NAME} key={property}>
                            <BooleanRow
                                value={this.props.data[property]["data"]}
                                selected={ROW_CLASS_NAME}
                            />
                        </td>
                    );
                } else if (this.props.data[property]["type"] === "enumerate") {
                    row.push(
                        <td className={ROW_CLASS_NAME} key={property}>
                            {this.props.data[property]["simplifiedData"].length}
                        </td>
                    );
                } else if (DATES.includes(this.props.data[property]["type"])) {
                    row.push(
                        <td className={ROW_CLASS_NAME} key={property}>
                            {this.props.data[property]["simplifiedData"]}
                        </td>
                    );
                } else {
                    row.push(
                        <td className={ROW_CLASS_NAME} key={property}>
                            {this.props.data[property]["simplifiedData"]}
                        </td>
                    );
                }
            }
        }
        return row;
    };

    render() {
        return <tr onClick={this.onClick}>{this.dataToRow()}</tr>;
    }
}

export default DataToRow;
