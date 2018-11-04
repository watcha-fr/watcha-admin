import React, { Component } from 'react';
import './User.css';
import BooleanRow from './BooleanRow';


export default class dataToRow extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  onSelect = () => {
    this.props.onUserSelected(this.props.data);
    this.setState({update: !this.state.update});
  }

  dataToRow = () => {
    const DATA = this.props.data;
    const ROW = [];
    const PK = this.props.primaryKey;
    const ROW_CLASS_NAME = this.props.data[PK] === this.props.selected[PK] ? 'rowSelected' : 'row';
    for (const property in DATA) {
      if ({}.hasOwnProperty.call(DATA, property)) {
        if (typeof this.props.data[property]['data'] === 'boolean') {
          ROW.push(
              <td className={ROW_CLASS_NAME}
                key={property}>
                <BooleanRow
                  value ={this.props.data[property]['data']}
                  selected={ROW_CLASS_NAME} />
              </td>);
        } else if (this.props.data[property]['type']==='enumerate') {
          ROW.push(
              <td
                className={ROW_CLASS_NAME}
                key={property}>
                { this.props.data[property]['simplifiedData'].length }
              </td>,
          );
        } else {
          ROW.push(
              <td
                className={ROW_CLASS_NAME}
                key={property}>
                { this.props.data[property]['simplifiedData'] }
              </td>,
          );
        }
      }
    }
    return ROW;
  }

  render() {
    let row = [];
    row = this.dataToRow();
    return (
      <tr
        onClick={this.onSelect}>
        { row }
      </tr>
    );
  }
}
