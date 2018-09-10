import React, { Component } from 'react';
import './User.css'


export default class User extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  onSelect = () => {
      this.props.onUserSelected(this.props.data);
  }

  dataToRow = () => {
    let data = this.props.data;
    let row = [];
    let rowClassName = this.props.data['userId'] === this.props.selected['userId'] ? "rowSelected" : "row";
    for (let property in data) {
      row.push(
        <td className={rowClassName} key={property}>{this.props.data[property]}</td>
      )
    }
    return row
  }

  render() {
    let row = []
    row = this.dataToRow();
    return (
      <tr onClick={this.onSelect}>
        {row}
      </tr>
    );
  }

}
