import React, { Component } from 'react';
import Datatorow from './DataToRow';
import {Table} from 'react-bootstrap';


export default class RoomTable extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const dataRoom1 =
    {roomId: 'conf', creator: '@joe', admins: '@joe', Active: 'True',
      Alias: 'conference'};
    return (
      <Table striped bordered condensed hover responsive>
        <thead>
          <tr>
            <th>Room Id</th>
            <th>Creator</th>
            <th>Admins</th>
            <th>Active</th>
            <th>Alias</th>
          </tr>
        </thead>
        <tbody>
          <Datatorow data={dataRoom1} pk='roomId' selected="false" />
          <tr>

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
