import React, { Component } from 'react';
import './User.css'


export default class User extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  onSelect= () => {
      this.props.onUserSelected(this.props.userId)
  }

  render() {

    let rowClassName= this.props.userId===this.props.selected ? "rowSelected" : "row"
    return (
      <tr onClick={this.onSelect}>
        <td className={rowClassName}>{this.props.userId}</td>
        <td className={rowClassName}>{this.props.creationTs}</td>
        <td className={rowClassName}>{this.props.admin}</td>
        <td className={rowClassName}>{this.props.userId}</td>
        <td className={rowClassName}>{this.props.email}</td>
      </tr>
    );
  }

}
