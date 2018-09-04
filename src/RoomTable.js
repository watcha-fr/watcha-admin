import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button,FormGroup,FormControl,Col,Form,Grid,Row,Table} from 'react-bootstrap';


export default class RoomTable extends Component {

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
      <th>Room Id</th>
      <th>Creator</th>
      <th>Admins</th>
      <th>Active</th>
      <th>Alias</th>
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
