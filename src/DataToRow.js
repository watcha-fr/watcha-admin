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
    const data = this.props.data;
    const row = [];
    const pk = this.props.primaryKey;
    const rowClassName = this.props.data[pk] === this.props.selected[pk] ? 'rowSelected' : 'row';
    for (const property in data) {
      if ({}.hasOwnProperty.call(data, property)) {
        if (typeof this.props.data[property] === 'boolean') {
          row.push(
              <td className={rowClassName}
                key={property}>
                <BooleanRow
                  value ={this.props.data[property]}
                  selected={rowClassName} />
              </td>);
        } else {
          row.push(
              <td
                className={rowClassName}
                key={property}>
                { this.props.data[property] }
              </td>,
          );
        }
      }
    }
    return row;
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
