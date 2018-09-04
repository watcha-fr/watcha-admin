import React, { Component } from 'react';
import User from './User';
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
      <th>User Id</th>
      <th>Creation ts</th>
      <th>Admin</th>
      <th>Partner</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
<User userId='@joe' creationTs='12 avril' admin='false' partner='false' email='joe@mailcom'/>
    <tr>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
      <td>Table cell</td>
    </tr>
    <tr>
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
