import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button,FormGroup,FormControl,Col,Form,Grid,Row,Table} from 'react-bootstrap';


export default class UserTable extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <Table striped bordered condensed hover responsive>
  <thead>
    <tr>
      <th>#</th>
      <th>User Id</th>
      <th>Creation ts</th>
      <th>Admin</th>
      <th>Partner</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
    </tr>
  </tbody>
</Table>
    );
  }

}
