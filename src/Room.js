import React, { Component } from 'react';


export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <tr>
        <td>{ this.props.roomId }</td>
        <td>{ this.props.creator }</td>
        <td>{ this.props.admins }</td>
        <td>{ this.props.active }</td>
        <td>{ this.props.alias }</td>
      </tr>
    );
  }
}
