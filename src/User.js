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
        <td>{this.props.userId}</td>
        <td>{this.props.creationTs}</td>
        <td>{this.props.admin}</td>
        <td>{this.props.partner}</td>
        <td>{this.props.email}</td>
      </tr>
    );
  }

}
