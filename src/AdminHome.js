import React, { Component } from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import DataToTable from './DataToTable';


export default class AdminHome extends Component {
  render() {
    return (
      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Users">
          <DataToTable tableName='user' token={this.props.token} server={this.props.server} />
        </Tab>
        <Tab eventKey={2} title="Rooms">
          <DataToTable tableName='room' token={this.props.token} server={this.props.server} />
        </Tab>
        <Tab eventKey={3} title="Stats">
          Tab 3 content
        </Tab>
      </Tabs>
    );
  }
}
